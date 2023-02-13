# Feature List

All available  features are listed below:

 1. User Authentication & Authorization
	 - Users are able to sign up, log in, log out
	 - Certain features like review a spot, view owned spots .etc request user log in
 2. Spots
	 - View all spots with no authentication needed
	 - View all spots belongs to current user with authentication required
	 - View a spot detail 
		 - un-logged in user can view spot detail information as well as all reviews of the specific spot
		 - logged in user can have the same feature as a un-logged in user, additionally can start a review of the spot or edit/delete previous review/review images. (not included the spot owner, to keep the review credible)
		 - spot owner will not able to review their own spots
	- Create a spot with authentication required
	- Spot owner can add image to their spots with authentication required
	- Spot owner can modify/delete their spots with authentication required
 3. Reviews
	 - View all reviews belongs to the current logged in user
	 - View all reviews of a specific spot
	 - Create a review for a specific spot if user logged in and is not the spot owner
	 - Modify /delete a review for a specific spot belongs to the current logged in user
	 - Add /remove images to a specific review the logged in user have written
## Future features

 - Bookings
 - Search
 - Host images using AWS
 - Use Google API show spot location
 
