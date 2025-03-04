from pymongo import MongoClient
from flask import Flask, render_template, g, request, jsonify, session
from dotenv import load_dotenv
import os
import certifi

app = Flask(__name__)
app.secret_key = "key"

ca = certifi.where()

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
db_name = os.getenv('MONGO_DATABASE')

def get_db():
    if "db" not in g:
        g.client = MongoClient(mongo_uri, tlsCAFile=ca)
        g.db = g.client[db_name]
    return g.db

@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop("db", None)
    if db is not None:
        g.client.close()


@app.before_request
def initialize_user():
    if "user_id" not in session:
        user_id = "user_" + str(hash(request.remote_addr))
        session["user_id"] = user_id
 
        db = get_db()
        users_collection = db['users']
        user = users_collection.find_one({"_id": user_id})
        movies_collection = db['scrapy_films']
        if not user:
            # Create a new user
            users_collection.insert_one({
                "_id": user_id,
                "movie_ids": []  # Initialize with an empty movie list
            })
        client.close()

@app.route("/get_movie", methods=["GET"])
def get_movie():
    """Fetch movie data by title."""
    db = get_db()
    movies_collection = db["scrapy_films"]
    users_collection = db["users"]
    movie_title = request.args.get("title")
    if movie_title:
        movie = movies_collection.find_one({"title": movie_title}, {"_id": 0})  # Exclude MongoDB ObjectId
        if movie:
            return jsonify(movie)
        return jsonify({"error": "Movie not found"}), 404
    return jsonify({"error": "Title parameter is required"}), 400


@app.route("/add_movie", methods=["POST"])
def add_movie():
    """Add a movie to the user's list."""
    user_id = session.get("user_id")
    movie_title = request.json.get("movie_title")
    
    if user_id and movie_title:
        db = get_db()
        movies_collection = db["scrapy_films"]
        users_collection = db["users"]

        # Find the movie by title in the movies collection
        movie = movies_collection.find_one({"title": movie_title})
        if movie:
            # Add the movie ID to the user's list
            users_collection.update_one(
                {"_id": user_id},
                {"$addToSet": {"movie_ids": movie["_id"]}}  # Use $addToSet to avoid duplicates
            )
            return jsonify({"message": "Movie added successfully"})
        return jsonify({"error": "Movie not found"}), 404
    return jsonify({"error": "Invalid request"}), 400


def fetch_db_data():
    if "db_data" not in g:
        user_id = session.get("user_id")
        if not user_id:
            return [] 

        db = get_db()

        # Fetch the user's movie IDs from the users collection
        users_collection = db["users"]
        user = users_collection.find_one({"_id": user_id}, {"movie_ids": 1})
        if user and user.get("movie_ids"):
            # Fetch the corresponding movies from the movies collection
            movies_collection = db["scrapy_films"]
            g.db_data = list(movies_collection.find({"_id": {"$in": user["movie_ids"]}}, {"_id": 0}))
        else:
            g.db_data = []  # No movies found for the user

    return g.db_data

@app.route("/")
def home():
    data = fetch_db_data()
    return render_template("index.html", data=data)

@app.route("/movie_data")
def movie_data():
    data = fetch_db_data()
    return render_template("movie_data.html", data=data)

@app.route("/my_list")
def my_list():
    data = fetch_db_data()
    return render_template("my_list.html", data=data)

if __name__ == "__main__":
    app.run(debug=True)