# Let's Stream

The Let's Stream Website project aims to create a website that uses Streaming API to fetch video URLs and implements the TMDB API to fetch movies and series data. It also includes a recommendation engine in Python that recommends the user's next movie or series to watch based on their recently played movies and series. The project will have a basic iframe implementation of Streaming API using a form to get the movies and series data, which is implemented in React and deployed on Netlify. The team is planning to switch the whole project to Cloudflare Pages for the front-end and serverless functions to run on Cloudflare Workers. They will also make a recommendation engine in Node.js or Python, whichever is easier to implement with the current prospect.

## Features

- **Authentication**: User authentication system powered by Firebase
- **Dark Mode**: Built-in dark mode support for better user experience
- **Infinite Scroll**: Seamless content loading with react-infinite-scroll-component
- **Responsive Design**: Built with Tailwind CSS for a fully responsive layout
- **PWA Support**: Progressive Web App capabilities with Workbox integration
- **Carousel**: Interactive content carousel using react-slick
- **Error Boundary**: Graceful error handling throughout the application

## Tech Stack

- React 18
- Firebase 11
- Tailwind CSS
- React Router v6
- React Slick
- Workbox (PWA)
- ESLint (Code Quality)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/chintan992/lets-stream.git
   cd lets-stream
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Firebase and TMDB API configurations.

```
REACT_APP_TMDB_API_KEY=YOUR-API-KEY
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## Usage

To run the application in development mode:

```bash
npm start
```

To create a production build:

```bash
npm run build
```

Then, open your browser and navigate to `http://localhost:3000` to view the application.

## Deployment

To deploy the application on Netlify, follow these steps:

1. Create a new site from Git in your Netlify dashboard.
2. Connect your Git repository.
3. Set the build command to `npm run build` and the publish directory to `build/`.
4. Click on "Deploy site".

## Production Build

To create a production build, run:

```bash
npm run build
```

This command will generate an optimized build of your application in the `build/` directory, ready for deployment.

## Project Structure

```
/React-Video-Player
│
├── /src
│   ├── /api
│   │   └── tmdbApi.js          # TMDB API integration
│   ├── /components
│   │   ├── AboutUs.js
│   │   ├── DarkModeContext.js  # Dark mode implementation
│   │   ├── Discover.js
│   │   ├── HomePage.js
│   │   ├── MediaDetail.js
│   │   ├── MediaForm.js
│   │   ├── MediaItem.js
│   │   ├── Navbar.js
│   │   ├── Search.js
│   │   ├── Login.js           # Firebase authentication
│   │   ├── Signup.js          # User registration
│   │   └── WatchPage.js
│   ├── /context
│   │   └── AuthContext.js     # Authentication context
│   ├── /firebase
│   │   ├── auth.js            # Firebase auth configuration
│   │   └── config.js          # Firebase app configuration
│   └── /hooks
│       └── useInfiniteScroll.js
```

## Contributing

For guidelines on how to contribute to this project, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Future Goals

1. **User profiles:** Create user profiles that store their recently played movies and series, their preferences, and their watch history. This will allow the recommendation engine to provide more personalized recommendations based on the user's viewing habits.
2. **Social media integration:** Allow users to share their favorite movies and series on social media platforms like Facebook, Twitter, and Instagram. This will help to increase the website's visibility and attract more users.
3. **Advanced search:** Implement an advanced search feature that allows users to search for movies and series based on various criteria such as genre, year of release, rating, and more.
4. **User reviews and ratings:** Allow users to rate and review movies and series. This will help other users to decide whether or not to watch a particular movie or series.
5. **Multiple languages:** Add support for multiple languages to make the website accessible to a wider audience.
6. **Mobile app:** Develop a mobile app for the Let's Stream Website project. This will allow users to access the website on their mobile devices and watch movies and series on the go.
7. **Live streaming:** Add support for live streaming of events such as movie premieres, award shows, and more. This will help to attract more users to the website and increase engagement.
8. **Subscription model:** Implement a subscription model that allows users to access premium content such as exclusive movies and series. This will help to generate revenue for the website and provide users with more options.
