# README


Done:
1. Create a redux boilerplate app
2. Create a "editor" component that has a scene and a number of pieces
3. Every time the scene is refreshed it updates the a-frame view
4. Put the a-frame

Add in saving of the piece
Add in list of pieces on the left
Add in creating a new piece
Add in updating properties
Add in deleting a piece
Add in uploading marker for piece
Add in orbit camera
Remove VR view
Get the image size back to editor
Do Minimal Styling
Style properties
Resize the square by aspect ratio
Resize the items to match the aspect ratio
Add in scaling of items by the scale of the marker
Add in API requests to mobile app
Add in downloading marker and to mobile app
Get Markers to load, play with it an see how it works
Make sure markers are loading and updating correctly
Add a back button
Add a refresh button 
- See about adding a socket connection to the server
- Subscribe to the channel on connect
- Broadcast updates of the space pieces to update a piece
- Accept the incoming message and update
Add in live updating of the piece 
- Add login into the mobile app
- segue to settings screen
- segue to the login screen

- Pass along API token for space

- Fix the losing focus on the object issue (maybe just don't update the page from the code until the code is edited?)
- Don't let users update the marker object

- Add buttons to switch tools in inspector

Fix updating / resetting the piece

- fix the updating

- figure out the component name vs. the attribute issue

- get annotations, need to figure out timing issues:
https://stackoverflow.com/questions/9506154/determine-if-javascript-syntax-is-valid-in-change-handler-of-ace
validate xml

- Don't update the scene if there's syntax errors in ace?

- On scene switches deselect everything

keep different undo managers for each piece / editor. Store the undomanagers in the component 


- Add a toggle inspector button


- Separate Assets tab

1. buttons to add elements at cursor

Steps:


- Catching errors


- Separate out preview into an iframe

- Pass code messages in and out
- If there's an error, do a full-rewrite refresh

- Save the camera positon to the piece and reset it when we bounce around


Finalize Rails:
2. add assets w/ keys on the src
3. add support for drag and drop of assets onto the assets tab (or actually any tab)



App:
Pull to refresh



$piece.click("id",function() {
  
})

$piece.load(function() {
    piece.get("id")

})

$piece.tick(function() {
})


Rails:


Thumbnail of each piece?
Fix scaling of and changing of the marker

Polish:
app - list of spaces I have access to
create an account w/ omniauth?

Figure out callbacks approach:
- id of each the elements -> 
- api for getting element
- api for creating elements

