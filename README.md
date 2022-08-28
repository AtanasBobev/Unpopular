![Opera Snapshot_2022-02-09_083235_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153143787-9987a7c1-163f-42ef-928d-586b4a2051d1.png)


* [Overview](#overview)  
* [Technologies](#technologies)  
* [Installation](#installation)  
* [How it works](#how-it-works)
* [Screens](#screens)
* [Videos](#videos)
* [Author](#author)
* [License](#license)

**Update: August 28th, 2022** | 
Due to Heroku's recent policy of canceling its free tiers, the project and its database are down indefinitely. All non-PII information has been preserved in this repository, and I hope one day I would find the time to relocate it. Until then, you can check the images and videos below or set-up using the given anonymized DB in the backup folder. Best, Atanas :)

**Update: February, 2022** | 
Currently live at:  [unpopular-bulgaria.com](https://unpopular-bulgaria.com)


## Overview 

Unpopular (Непопулярно) is a full-stack web application that allows people to share interesting places in Bulgaria. Users can upload text and images into cards that present places. Automatic weather fetching, note-taking, map, comment section, and more are part of each card. Every registered user can share content, like, save, suggest edits to existing places, download and report content, and more. The account controls allow for a change of password, username, email, upload an avatar, and more. Account protection is at the forefront with account locking, multiple mechanisms ensuring security, minimal data collection, and more. Admin controls allow for user data control, place modification, report managing, etc.

## Technologies

 - ReactJS - front-end library
 - MaterialUI - UI library
 - HCaptcha for preventing bots
 - JSON Web Token for authentication through cookies and Local Storage (more on that in How it works)
 - React Router for routing components
 - Node.js - server 
 - Express - server-side framework
 - PostgreSQL - database
 - Cloudinary for saving and serving images
 - SendGrid for sending mails 
 
*Additional libraries can be found in packege.json, but the major ones are:*
 - axios for fetching data
 - geolib for coordinate verification
 - leo-profanity - profanity filter for uploaded content 
 - moment.js - date calculations and visualizations in a local format
 - password-validator - validating passwords based on criterias
 - pigeon-maps - an alternative of Google Maps for displaying data in an
   interactive way 
 - qrcode.react for generating QR codes 
 - tsParticles - creating particle animations
- Tilty - creating tilting animations on components 
- toast.js - UI notification component
 - react-typewriter-effect - for creating typewrite animation in the App
   Bar 
 - share-buttons - share places in social medias given data

## Installation 


 1. Clone the repository
 2. By default, the project is intended to work on [unpopular-bulgaria.com](https://www.unpopular-bulgaria.com), which is why you should use the *replace in files* command to set it to a localhost and the desired port. NB: In the future the project may be relocated, but the procedure is the same. Then do this correspondingly for the back-end by setting express to listen to, e.g., localhost:5000 and frontend to localhost:3000. 
 3. In the [CORS array](https://expressjs.com/en/resources/middleware/cors.html#enable-cors-for-a-single-route), you should change the URLs to your localhost and IP, e.g., localhost:3000 otherwise [no requests would pass through](https://stackoverflow.com/questions/56792954/cors-error-on-localhost-is-that-a-normal).
 4. Setup a database in PostgreSQL as per the .sql file provided. Connect it by creating a `DATABASE_URL` enviromental variable containing Postgres connection string. [Alternatively, you may pass each properties individually.](https://node-postgres.com/api/pool) 
 5. Setup a [Cloudinary](https://cloudinary.com) account for image storage by creating an account. Then create [4 environmental variables](https://cloudinary.com/documentation/node_integration): `cloud_name`, which would store the name of the cloud we are uploading to; `api_key` for the API key; `api_secret` for the API key; `folder_upload` for the folder to which we are uploading.
 6. Create an environmental variable `cookieSecret` , and enter your [cookie secret](https://stackoverflow.com/questions/47105436/how-and-when-do-i-generate-a-node-express-cookie-secret/47113162) paraphrase. Do the same with `jwtSecret` [variable](https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it).
 7. The app uses  email in order to send notifications to the users, so it is  time to setup enviromental variables for that. Setup `emailUser` and `emailPassword`where the former is the email address, the latter is the password of the Gmail account. Remember to [turn less secure apps on](https://nodemailer.com/usage/using-gmail/). 
In order to actually send email, you need to get and setup a SendGrid enviromental variable named `sgAPI`. Remember to [verify the email address](https://docs.sendgrid.com/ui/managing-contacts/email-address-validation) before setting it, otherwise SendGrid would not work. You may easily switch to [Nodemailer](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/) for local development.
 9. The app checks for temporary emails on registration and email change, which is why `tempMail` API key is needed. You may obtain one from https://istempmail.com
 10. Obtain an [OpenWeather API](https://openweathermap.org) key and put in a `weatherAPI` environmental variable.
 11. Finally, go to [HCaptcha](https://www.hcaptcha.com), obtain a key and put it in a `captcha` enviromental variable. Keep in mind that it would not work locally, you should use demo keys for [local development](https://docs.hcaptcha.com/#local-development).
 12. On heroku server run `npm run start`. On custom server run `npm run build`. On development run `npm run dev`.
 13. Starts the back-end on server with `npm start`. You may use nodemon in developmnet. 

## How it works
**Security Overview**

For any authentication purposes, the website uses two JWT tokens. They are both protected by a jwt secret, and carry identical information, but have a random parameter that differentiates them. One of the tokens is stored within a secured httpOnly cookie, while the other is saved in the localStorage. The latter is used by the front-end to access email, username, user_id, and others as an alternative to sending requests each time user data is needed. The back-end checks if the tokens are not identical, which means that one cannot simply copy one of the jwt in another, e.g., copying the cookie token to the localStorage or vice versa. Admin endpoints work similarly, except that they check whether admin=true in the `users` table. Additionally, each method is throttled by default to 5 requests per second. bodyParser ensures that no scripts pass through. Each request is limited to 5kb. Helmet ensures that no unencrypted requests pass through. Parametrized input in queries ensures that no SQL vector for attacks is open. Since React treats parameters and even HTML in variables as just text, XSS attacks are impossible.

**Database**

PostgreSQL has 14 tables that interact through primary and foreign keys.
![Untitled (1)](https://user-images.githubusercontent.com/43994025/153134286-bd11f13a-6ea9-40ee-a0f4-aa387aa85212.png)



**Registration**

The request is at first throttled to 2 requests per second. Next, there is a check if all required inputs are available and are the correct lengths and format. There is  a check if the provided email is temporary. If yes, code 400 is returned. A token of length 100 characters with random symbols is generated. Then a password is encrypted with 15 Salt rounds. Should this be successful, the data is inserted in the `users` database with the token in the verified field. Next, a check for a conflict with existing records is done. If there is, return code 409. ID provided is obtained from the serial field in the `users` database.  Two tokens, one of which would be stored in a secure cookie and one in localStorage are generated. Both have a random parameter that would differentiate them. A response with the JWT and the cookie are sent. Both tokens have `verified=false`. Email with the verification token is sent. The user clicks on the link, the token is checked against the `users` table verified field and if correct, verified is set to true and a new pair of JWT tokens with verified=true is sent.
 
**Authentication**

Function `authorizeToken` and `authorizeTokenFunc` are used. The first is a middleware that calls `next()` when the presented token carries both localStorage JWT and cookie. The second outputs the data to an object, but in its essence, it works almost identically. Both methods first check if the cookie matches the localStorage token value. If so, that means that the user doesn't really have two different authentic tokens, but rather has copied one of them. Response 401 is returned. If the tokens are different they are decrypted with the private key . If they contain identical information, this means that the user is legitimate, otherwise, response 401 is returned.

Similar functions `adminToken` and `adminTokenFunc`exist for the admin tokens. They operate on a similar principle, but check the `users` table if the user is actually an admin, thus sacrificing speed to security.  If the user is not an admin, response 403 is returned.

**Login**

Similarly, as the registration endpoint, requests are limited to 2 per second. The first check is whether all needed data is present and at the required string format. The hash is then retrieved from the `users` database. The provided password is encrypted and the hash generated is compared against the hash received. If no records exist for the currently provided data, response 409 for no associated records. Should the request be unsuccessful, a login attempt is added with the user IP address to the `unsuccessfulAttempts` table. On each request to this API, it is checked whether the total number of attempts exceeds 5, if so, the profile is locked. If the profile is locked, an unlock URL is provided in an email containing an unlock token and the IP addresses of the attempts. If the user unlocks their profile, the IP attempts are deleted.

**Comment/Reply**

The server checks whether the accepted format is a string and whether a token is provided. Then, the data is put in the `comments` table as a comment with a score of 0. If the same comment has already been published, code 409 is returned, otherwise, code 200 is returned. The reply method works similarly.

**Notes**

The notes component is a bit more special because it uses an external rich text editor. The data is verified for minimum length with the option to initialize the component with the default for the editor. The data is then sent to the server on a button click. On the server-side, the user token is authorized, the needed parameters are checked, if they don't exist, response 400 is sent. If the place_id exists and length does not exceed 5000 characters(this also could be HTML), the entry is inserted into the `notes` table conditionally. If it already exists, an UPDATE statement is used, if not, an INSERT statement. If both queries are successful, response 200 is sent back. On the profile page, an aggregate of all notes can be previewed. This is done on the server-side first by throttling to 2 requests per second. Then required data is received and displayed on the front-end with the .map method.

**Weather data**

The weather component is dependent on a parent one for receiving the data. useEffect is called upon render and data from the server-side. The required parameters are latitude and longitude. Then, a request is done to the OpenWeather API in a one-call format. The received data is sent in its raw JSON format to the front end, where it is displayed through the .map method and the dates are converted to local with moment.js. This data is not saved on the server.

**Map component** 

The Map component uses [PigeonMaps](https://pigeon-maps.js.org), which is a component on top of OpenStreetMaps. The Map has a center, which is dynamically received from the getCenter function of geolib. The function receives the places and finds their center point on the map. User location and received places are displayed with the `Marker` component, which receives its colors from functions that convert the different categories into colors. Sorting by location is done through a 2D-like array where the first element is the coordinates, and a second element is an object with the data of the place. This data is then transferred to the <Card components through the .map function. 

**Quotes/Poems**

JSON containing all the poems and quotes is in the widgets folder. Both components choose one at random and load the data. Image components are passed onto img. Assuming an error, a failsafe quote, and poem are available to be presented. Both components are shown on a random basis. The check is whether each neighboring card can be divided by a random number between 10-20 without remainder. You may manually add more quotes and poems if you wish to or change the algorithm.

**Places**

On page load a useEffect calls for the search function, which assumes a default value of limit and empty search query. The `places` table is then tasked with providing the most popular places by likes. Should a user decide to change the limit, sorting, or any of the categories, onBlur is called to save the data. Since the data is changed, new requests on the /search route are done. The fetched data from the table is then grouped based on the place name, which is not a primary key but has a unique constraint. Then, the presented data is converted into an array of objects, and on the search method, an additional function checks for missing data in the presented array, effectively limiting errors caused by undefined fields. This is more of an error handling should the database be set up incorrectly. The data is finally sent to the front end, where it is given in the form of cards. Each card upon opening retrieves data about the weather at the specific geographic coordinates, notes about the place as well as comments and replies. The <Map components are responsible for displaying the location on a map. 
When uploading places, the user has to enter all categories, a description, and a title that is checked for profanities, lengths, and overall content. The user can upload up to 3 images with a limit of 3MB. The way image handling is done is by converting the FileObject array into a standard array and obtaining its properties. On the back-end, hcverify checkes if the provided token by *HCaptcha* is correct and multer handles the image upload to Cloudinary thorugh *multer-storage-cloudinary*. The rest is a check whether app parameters are the correct length, type and don't contain illegal characters. Finally, all parameters are inserted in the `places` table.
The same component for uploading places is used for updating them, the only difference is that if the user doesn't own the place(check by id on the front-end and `places` table on the backend), his request for an edit is put in the `suggested_places` table. The user who owns the place is sent an email and can either accept the change or delete it. If the change is accepted, the user who suggested it receives an email. If the user indeed owns the place, his request directly updates the previous one. Upon page reload, all edited data can be seen.  Places have a unique id, which is a primary key and is used when reporting the place, posting a comment on it, editing it, etc. All images upon edit overwrite the previous ones.

**Report**

All registered and verified users can submit reports about places, comments, and replies. This is incredibly useful because it helps with moderation. If the user has a verified account (checked by decrypting the localStorage JWT with jwt_decode), they are presented with a button to report the place. The report must a minimum of 20 characters and a maximum of 5000. All reports are submitted with the id of the place/comment/reply, the type of element that is reported, and the user who reported the place. In the admin panel, reports can be given a score, or sorted by the date presented. Each report provides a view button, which shows the place/comment/reply is a new tab. The admin can edit/delete the element or delete the user as a whole. If the admin can put a score on the reports between -1 and Infinity. If a score is -1, the report is immediately deleted. The bigger the score is, the higher the element appears when ordered.

**Share**

The share element allows the user to share a place to social medias, download the place, get a link and a QR code. In contrast to other elements, it doesn't require as much on a back-end, but rather takes the id of the place to be shared, converts it to base64 format, adds a link to it, and passes it as a prop to social shares buttons. QR code is then generated based on this url, and a download button is also present. When clicking the button, the back-end aggregates all the information in the `places` table with regards to this place, adds the images and sends the file for download. The front-end creates a blob and downloads the file in a .json format.

## Screens
**User panels**
The main page
![Opera Snapshot_2022-02-09_083235_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153143787-9987a7c1-163f-42ef-928d-586b4a2051d1.png)
Cards overview
![Opera Snapshot_2022-02-09_083337_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153143981-9913a376-1e93-4bd5-848a-7a3dff3e55a1.png)
Bottom load more button
![Opera Snapshot_2022-02-09_083414_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153144027-6966996e-4002-4ce3-be3f-55df550a6533.png)
Opened card
![Opera Snapshot_2022-02-09_083432_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153144680-5d7acc00-9136-4d86-a05c-4e6ab3bc3b28.png)
Card map and categories
![5](https://user-images.githubusercontent.com/43994025/153144927-9b89a889-a37d-4ec0-8bf8-d173930ad0ff.png)
Weather component
![6](https://user-images.githubusercontent.com/43994025/153144954-6100c1c5-ab20-4082-ac38-af6b92c2c301.png)
Comment section
![Opera Snapshot_2022-02-09_083627_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153144996-9b2e4b41-df68-44bf-bb0d-1fbe1907bbb0.png)
Edit place/suggest edit funcitonality
![Opera Snapshot_2022-02-09_083640_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153145029-3089d3fe-2cd3-4927-88dd-acc332aefd1f.png)
Share
![Opera Snapshot_2022-02-09_083653_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153163023-559f6442-3ba9-454f-bca0-e62a88893933.png)
Report
![Opera Snapshot_2022-02-09_083959_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153163086-c9728cfb-2eff-4449-a2ce-e8b2cd9f4092.png)
Filters in the search component
![Opera Snapshot_2022-02-09_083316_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153145645-bdb390a5-1ee1-4dd1-8fd2-9c8a48bb556e.png)
Upload place
![Opera Snapshot_2022-02-09_084545_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162335-c1ba1439-d45d-4305-b8d8-b77f733e6935.png)
![Opera Snapshot_2022-02-09_084613_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162339-24cb6d4e-be59-4773-a44e-18b25941200f.png)
![Opera Snapshot_2022-02-09_084625_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162346-b78a9cb3-b85e-47cd-8418-2a09a4e643d8.png)
![Opera Snapshot_2022-02-09_084636_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162354-9c45e02b-e0d2-4b80-bd39-ada92249df8e.png)
Account notes
![Opera Snapshot_2022-02-09_084254_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162431-8a8f8f37-170b-4865-adbe-766b283805a5.png)
Avatar change
![Opera Snapshot_2022-02-09_084458_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162462-f2f0168a-d201-4a88-8b62-55f20db5aba1.png)
Profile page after an avatar change
![Opera Snapshot_2022-02-09_084512_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162493-a2d6f908-8af4-480a-a2c5-529b1c3d29e0.png)
Settings panel
![Opera Snapshot_2022-02-09_084528_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162569-b731a71d-09a3-49cc-a1f1-68ed89adcd0f.png)
Register
![Opera Snapshot_2022-02-09_095427_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162241-bb4b895d-daca-487f-a41f-3185d876bb9c.png)
Login
![Opera Snapshot_2022-02-09_095539_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162262-ae361cff-118b-49f2-99ba-0e33e2dcd3a1.png)
Verify email
![Opera Snapshot_2022-02-08_223512_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162865-f5c2f037-b50a-405f-8637-954c4c8aa47f.png)
Liked places component
![Opera Snapshot_2022-02-09_084050_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162920-fafed057-6541-4756-813d-ea034e5fdf04.png)
Saved places component
![Opera Snapshot_2022-02-09_084104_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162945-b8d3a30f-15cc-4420-b632-f46ae87a7248.png)
About me page
![Opera Snapshot_2022-02-09_084747_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162287-af345f58-4c55-4504-98f2-ed29b0d27770.png)
Change password
![Opera Snapshot_2022-02-09_112923_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153166150-e4580e57-00f2-46ad-b3a3-9a39bf977ef1.png)

**Admin-panel**

Statistics
![Opera Snapshot_2022-02-08_223057_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162703-ceec50a9-f7ca-4075-8044-2c3bbc88d969.png)
Failed login attempts
![Opera Snapshot_2022-02-08_223109_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162750-f0367426-7ee9-4f60-beb6-e1bb7c9c6a60.png)
Comments
![Opera Snapshot_2022-02-08_223131_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162769-1ba3ea6a-2f1b-40d4-b284-be7253f13719.png)
Users
![Opera Snapshot_2022-02-08_223320_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153608124-b774079c-d4d6-4c99-82fe-539558d5de8c.png)
Reports
![Opera Snapshot_2022-02-08_223342_unpopular-bulgaria com](https://user-images.githubusercontent.com/43994025/153162825-451f338f-f262-4b2b-94e1-203abe0e9f00.png)

## Videos

[User UI](https://www.youtube.com/watch?v=MxT_ZJdwjVs)

[Admin UI](https://www.youtube.com/watch?v=d_uEIWIVyOM)

## Author

Created by Atanas Bobev 2021-2022

## License

MIT License applies 

~~Custom terms and conditions apply for the production version on unpopular-bulgaria.com and unpopular-bulgaria.herokuapp.com~~


