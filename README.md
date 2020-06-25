
##  A Vue js Based GD Index
##### by _[Shan.tk](https://github.com/tks18)_

_Site - [Click Here](https://glorytoheaven.tk)_

#### Complete Site Inspiration from [Aicirou](https://github.com/Aicirou)

*This is a Complete Rebuild from Aicirou's Gindex with Changes to Theme and Framework.*

**Important** - _This Site Requires My GIndex Live Backend Server to be Running Otherwise the Site will Never Open._

#### Site Features

1. This Site is Not Like Basic GIndex which Depends on Basic Auth  Headers to Authenticate the Users. Rather this has its Own Backend Through Which Users will be Validated.

2. Uses Custom Video Player - Plyr to Stream Videos.
3. Uses Custom Audio Player - Plyr
4. Complete Dark theme.
5. User Role Based Authentication.
6. No Public can Access Site's Content Without Logging in.
7. Uses JWT to Verify User's Login on Each Route.
8. JWT is Valid for a Week. After Expiry the User will get Automatically Logged out.
9. Also User's JWT Token is Stored in LocalStorage as AES 256 Encrypted Key . This will be Decrypted on Demand. So that No One Can Access the User Details even if they have the Key.
10. Fully Material Redesign of all Pages. (Under Progress).
11. Has 3 Roles - User, Admins, Superadmins
	- Users - Can Only View Content.
	- Admins - Can Accept Users based on their Request
	- Superadmins - Can Accept Admin Requests.
12. Uses MongoDB for User Database.
13. Full Access Control of Backend from Frontend Based on User's Role.
