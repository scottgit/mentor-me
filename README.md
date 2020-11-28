<img src="./frontend/public/images/mentor-me-logo.svg" width="50" height="50">

# Mentor Me

Mentor Me is a website designed to privately connect Mentors with Mentees for purposes of having discussions and allowing Mentors to make goals and Mentees to achieve those goals for their growth. The usefulness of the site only comes about by a Mentor and a Mentee making a connection, which establishes the relationship needed for discussions to occur and goals and progress to be tracked. 

## Technologies

Mentor Me utilizes:

  - **Backend**: Node.js, Express, Sequelize (with a PSQL database)
  - **Frontend**: React, Redux
  
## Styling

All CSS styling was implemented *without* the use of a pre-built library other than a `normalize.css` from the `npm` install of `"normalize.css": "^8.0.1"`. Use of css variables via the `var(--property-name)` syntax was utilized on the `html` element to set up for later potential theming of colors on the site. 

Additionally, `svg` was utlized on the logo (exported from Adobe Illustrator) and re-configured in a JavaScript file to make it accessible via a CSS class and targeting of specific `polygon` portions within the `svg` element (the outer big M and inner smaller M), like so:

SVG
```js
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="124px" height="124px" 
  viewBox="7.429 5.259 99.569 123.83" enableBackground="new 7.429 5.259 99.569 123.83" 
    className="logo" // ADDED this className attribute to target
  >
   <polygon className='logo__big-m' // ADDED this to target Big M specifically
     points="85.557,5.259 56.575,33.34 29.188,5.259 7.429,5.259 7.429,129.466 27.94,129.466 27.94,51.349 39.799,51.349
     56.575,71.473 74.514,51.349 86.717,51.349 86.717,129.466 106.998,129.466 106.998,5.259 "/>
   <polygon className='logo__small-m' // ADDED this to target Small M specifically
     points="69.623,68.328 56.969,81.303 44.923,68.328 34.676,68.328 34.676,129.089 47.153,129.089 47.153,91.838
     50.955,91.838 56.969,99.276 63.392,91.838 67.361,91.838 67.361,129.089 79.752,129.089 79.752,68.328 "/>
  </svg>
```

CSS for SVG (simplified for illustration of what occurs on the main navigation bar logo)
```css
.logo {
  fill: var(--primary-color); // Change color of logo based on primary theme color used
  margin: 5px 5px 5px;
  height: 40px;               // Scale the svg
  width: 40px;                // Scale the svg
}

// When the link on the main nav, which includes the logo, is hovered, change the smaller M's color
.main-nav__logo-link:hover .logo__small-m {
  fill: var(--primary-color-50a); 
} 

```

## Features

### Handling Aspects of User Roles
Users can be in a role of Mentor, Mentee, or both, to one another. The sequelize association is a many-to-many between `Users`, thorough a join table of `Connections` where a row in that table only exists if there is some type of connection between users, and if a connection exists, the status of that connection can be one of three levels (`pending`, `established`, or `rejected`). It is through `Connections` that all other role functionality (discussions, goals, etc.) exist between users. In the `Connections` join table, the `mentorId` indicates which user is in the role of a Mentor in the relation, and the `userId` indicates the Mentee. As such, the `foreignKey` and `otherKey` change depending on the role in that connection as the following association definition indicates (note the changes in the keys and the `as`):

```js
User.belongsToMany(models.User, {
  through: 'Connections',
  as: 'mentoring',
  foreignKey: 'mentorId', 
  otherKey: 'userId'      
});
User.belongsToMany(models.User, {
  through: 'Connections',
  as: 'learning',
  foreignKey: 'userId',
  otherKey: 'mentorId'
});
```
This complicated set of relations between users created a number of interesting challenges to implement in both the backend and frontend code. Two in particular were:

1. **How to query in order to return the other user objects from a connection?** At first, I thought this should happen with query on the `Connections` table, but that ran into difficulties since no direct association was between that table and `Users`. So instead, querying via `Users` was the solution, doing an include of itself (here is an example of the method on the `User` model to find a user's mentors):

    ```js
    static async getMentorsForId(id) {
      const res = await User.scope('currentUser').findOne({
        where: {id},
        include: [{
          model: User.scope('publicUser'),
          through: 'Connections',
          as: 'learning',
          through: {
            attributes: ['id'],      // The connection id was needed for some processing, so is returned through this
            where: {
              userId: id,            // Since the user is the mentee, then it is the `userId` that needs matched; 
                                     // for finding mentees of a user, then this would be `mentorId: id` instead
              status: 'established', // Only the established connection status is an active 'mentor'
            },
          }
        }]
      });
    ```
1. **How to merge an included table's key to be a key for queried table on the returned node?** Connections between two users can have various `Discussions` associated to them. As such, there was a case where the `status` key from the `Connections` table was important to include when making a query to the `Discussions` table. I knew I could get the `status this way:

    ```js
    Discussion.findAll({
      where: { connectionId },
      attributes: ['id', 'title'],
      include: {
        model: sequelize.models.Connection,
          attributes: ['status'],
          where: {
            status
          }
        },
    })
    ```

    But that returns an object for each discussion that has a key of `Connection` pointing to another object containing `status`, when what I wanted was the `status` to become a key on the returned discussion object: 

    ```js
    // What was returned ...
    { <discussion keys>,
      Connection: {status: <someStatus>} // Nested status key under Connection
    }
    
    // What I wanted returned ...
    { <discussion keys>,
      status: <someStatus> // An added status key obtained from Connection
    }
    ```
    
    The solution effectively was this (simplified from the actual code implementation where I build a conditional `include` clause), where a new `attribute` is defined based off the `Connection` column's attribute:
    
    ```js
    Discussion.findAll({
      where: { connectionId },
      attributes: [
        'id', 
        'title', 
        [sequelize.col('Connection.status'), 'status']  // This moves the column to a named key on the returned object
       ],
      include: {
        model: sequelize.models.Connection,
          attributes: [], // Avoid returning any attributes nested under a Connection key
          where: {
            status
          }
        },
    })
    ```

### Front End Display
There were many aspects to front end display required for good user experience, many of which required various conditional checks based of the user role. But while these conditionals could at times be challenging to implement well, they were not two of the top challenges. Instead, that distinction comes from these two desires:

1. **How to get JavaScript `Date` objects passed through JSON to reconvert to a `Date` object and then make them in user friendly display form to be saved in the Redux stored object?** Certain `createdAt` and `updatedAt` dates from the data models that passed to the front end, I wanted to make into user friendly strings. After passing through `JSON.stringify()`, these keys would just be ugly date strings (e.g.`2012-04-23T18:25:43.511Z`). This challenge ended up being met by some research and then the construction of a helper function (that itself has a nested helper function). In this helper function, the `obj` is a larger object containing these date keys with the ugly strings. Those keys are repurposed to contain a new object containing `date` and `time` keys that have been nicely formatted, all using the original ugly string to re-form a new `Date` object.

    ```js
    export function reviveDates (obj) {
      // This helper takes in the ugly dateString, uses that to create a re-vitalized Date object, 
      // then reformats with the methods to cast to `Locale` based format.
      function formatDateTime(dateString) {
        const date = new Date(dateString).toLocaleDateString('en-US');
        const time = new Date(dateString).toLocaleTimeString('en-US');
        return {date, time};
      }
      // All that was needed was a replacement of the particular date keys with the newly desired information
      if (obj.createdAt) {
        obj = {...obj, createdAt: formatDateTime(obj.createdAt) }
      }
      if (obj.updatedAt) {
        obj = {...obj, updatedAt: formatDateTime(obj.updatedAt) }
      }
      if (obj.Connections && obj.Connections.createdAt) {
        obj = {...obj, Connections: {...obj.Connections, createdAt: formatDateTime(obj.Connections.createdAt)} }
      }
      // Then return back the object
      return obj;
    }
    ```
2. **How to create a flexible Modal dialog in React?** An original plan used an App-wide context for the modal, but that proved to have issues where once a user logged in (which was done via a modal), it immediately switched the modal to the one asking if the user wanted to log out! Not a good user experience. Additionally, I wanted flexible, contextual modals that allowed any type of `children` to be in that modal. The solution was the following:

    1. Code the Modal.js component and include its own Context
        ```js
        import React, {useContext, useRef, useState, useEffect} from 'react';
        import ReactDOM from 'react-dom';
        import Icon from './Icon'

        export const ModalContext = React.createContext();

        export const ModalProvider = ({children}) => {
          const modalRef = useRef();
          const [showModal, setShowModal] = useState(false);
          // The default values here allow for passing the needed functions to give
          // children the capablity of "closing" the modal after it is shown
          const [value, setValue] = useState({modalNode: null, showModal, setShowModal});

          useEffect(() => {
            const modalNode = modalRef.current;
            setValue({modalNode, showModal, setShowModal});
          }, [modalRef, showModal]);

          return (
            <>
              <ModalContext.Provider value={value}>
                {children}
              </ModalContext.Provider>
              <div id='modal' ref={modalRef} />
            </>
          );
        }

         const Modal = ({children}) => {
          const {modalNode, setShowModal} = useContext(ModalContext);

          if (!modalNode) return null;

          return ReactDOM.createPortal(
            <div className='modal'>
              <div className='modal-content'>
                <Icon
                  icon='times-circle' wrapperClasses={`modal-close`}
                  click={() => setShowModal(false)}
                />
                {children}
              </div>
            </div>,
            modalNode
          );
        }

        export default Modal

        ```
    2. Be able to attach the modal to a trigger component (a button, etc.), to cause the modal to show. This was done with another component (with a default to a `button`):
        ```js
        import React, {useContext} from 'react';
        import  Modal, {ModalProvider, ModalContext}  from '../Includes/Modal';


        function Trigger({children, triggerComponent, buttonClasses, buttonText}) {
          const {showModal, setShowModal} = useContext(ModalContext);

          if (!triggerComponent) {
            triggerComponent = (
              <button className={buttonClasses} onClick={() => setShowModal(true)}>{buttonText}</button>
            )
          }

          return (
            <>
              {triggerComponent}
              {showModal && (
                <Modal>
                  {children}
                </Modal>
              )}
            </>
          );
        }

        const ModalTrigger = (props) => {
          return (
            <ModalProvider>
              <Trigger {...props}/>
            </ModalProvider>
          )
        }

        export default ModalTrigger;
        ```
    3. Use the modals in various contexts (here, a login button in the main nav utilizes the built in `button` of the `ModalTrigger` component); it was also used for a `Confirm` component to confirm or cancel the logout of a user:
       
        ```js
        <ModalTrigger buttonClasses='button main-nav__login' buttonText='Log In'>
          <LoginForm />
        </ModalTrigger>
        ```
## Live Site Link

You can see the live version at https://mentor--me.herokuapp.com/
