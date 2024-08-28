const urlparam = new URLSearchParams(window.location.search);
const login_message = urlparam.get("login_message");
const post_message = urlparam.get("post_message");
const feedback = document.querySelector(".feedback");



const categories = document.querySelectorAll(".post-recommendation p");

const postContainer = document.querySelector('.home-article')


let username = localStorage.getItem('username').trim()
username = username.trim().replace(/^"|"$/g, ''); // trim any spaces and remove quotes

if (login_message) {
  feedback.children[1].textContent = login_message;
  feedback.style.visibility = "visible";

} else if (post_message) {
  feedback.children[1].textContent = post_message;
  feedback.style.visibility = "visible";
}


// Function to remove a query parameter
function removeQueryParam(param) {
  // Get the current URL
  let url = new URL(window.location);

  // Create a URLSearchParams object from the query parameters
  let params = new URLSearchParams(url.search);

  // Delete the specified query parameter
  params.delete(param);

  // Set the new URL without the deleted parameter
  url.search = params.toString();

  // Update the URL in the browser without reloading the page
  window.history.replaceState({}, document.title, url.toString());
}

// Usage: Remove the 'post_message' query parameter
removeQueryParam('post_message');



const getUserDetail = function () {

  // this is gotten from the script tag embedded in home.html head tag.
  const userDataElement = document.getElementById('current_user');
  // Parse the JSON data from the script tag's text content
  const currentUser = JSON.parse(userDataElement.textContent);

  // persist the user state in a local storage for easy accessiblity
  localStorage.setItem('username', JSON.stringify(currentUser.username))
  localStorage.setItem('is_authenticated', JSON.stringify(currentUser.is_authenticated))
  localStorage.setItem('is_active', JSON.stringify(currentUser.is_active))
  localStorage.setItem('id', JSON.stringify(currentUser.id))
  localStorage.setItem('email', JSON.stringify(currentUser.email))
}


function deletePost(e) {
  if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
    e.preventDefault(); // Prevent default behavior if needed

    let deleteButton = e.target.closest('.delete-btn'); // Find the closest .delete-btn if clicked inside it

    let body = document.body;
    body.classList.add('modal-active');
    body.classList.add('overflow');
    document.querySelector('.delete-modal').classList.remove('hide-modal');

    // Dynamically construct url for delete view function in the form action
    let delete_url = deleteButton.getAttribute("data-post-id");
    let form = document.querySelector(".delete_form");

    // Send delete request to server
    form.action = delete_url;
  }
}

// Attach the event listener to the container
postContainer.addEventListener('click', deletePost);



// CANCEL MODAL
function cancelModal() {
  let cancelDeleteModal = document.querySelectorAll(".cancel-delete-modal");
  if (cancelDeleteModal) {
    cancelDeleteModal.forEach((element) => {
      element.addEventListener("click", function () {
        document.querySelector('.delete-modal').classList.toggle('hide-modal')
        document.body.classList.remove('modal-active')
        document.body.classList.remove('overflow')
      });
    });
  }
}


const renderHomePosts = function () {
  // fetch request for posts
  fetch(`/filter_posts`)
    .then((response) => response.json())
    .then((data) => {
      if (data.posts) {
        let username = localStorage.getItem('username')
        username = username.trim().replace(/^"|"$/g, ''); // trim any spaces and remove quotes

        const all_posts = data.posts;

        let innerhtml = '';
        all_posts.forEach((post) => {
          // Determine if the current user is the owner of the post
          const isOwner = post.author === username;

          innerhtml += `
            <main class="home-main">
              <div class="home-main-div">
                <h4>${post.author}</h4>
                <p>${post.created_at}</p>
                <!-- new post -->
                <div class="new-post">
                  <p>new</p>
                </div>
              </div>
              <div class="post-div">
                <h1 id="title">${post.title}</h1>
                <p id="content">${post.content}</p>
              </div>

              ${isOwner ? `
              <!-- include only for current users -->
              <div class="cta" style="display: flex;">
                <a href="${post.edit_url}" class="edit-btn">
                  <i class="fas fa-edit"></i> Update
                </button>
                <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
              ` : ''}
            </main>`;
        });

        // Update the DOM with all posts at once
        postContainer.innerHTML = innerhtml;
      }
    })
    .catch((err) => console.error(err));
};

// RECOMMENDATION
categories.forEach((e) => {
  e.addEventListener("click", () => {
    let category = e.textContent;

    // SEND A GET REQUEST TO SERVER FOR POST CATEGORY.
    fetch(`/filter_posts?category=${encodeURIComponent(category)}`)
      .then((respone) => respone.json())
      .then((data) => {

        if (data.posts) {
          let username = localStorage.getItem('username')
          username = username.trim().replace(/^"|"$/g, ''); // trim any spaces and remove quotes

          const all_posts = data.posts;

          let innerhtml = '';
          all_posts.forEach((post) => {

            // Determine if the current user is the owner of the post
            const isOwner = post.author === username;

            innerhtml += `
            <main class="home-main">
              <div class="home-main-div">
                <h4>${post.author}</h4>
                <p>${post.created_at}</p>
                <!-- new post -->
                <div class="new-post">
                  <p>new</p>
                </div>
              </div>
              <div class="post-div">
                <h1 id="title">${post.title}</h1>
                <p id="content">${post.content}</p>
              </div>

              ${isOwner ? `
              <!-- include only for current users -->
              <div class="cta" style="display: flex;">
                <a href="${post.edit_url}" class="edit-btn">
                  <i class="fas fa-edit"></i> Update
                </button>
                <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
              ` : ''}
            </main>`;
          });

          // Update the DOM with all posts at once
          postContainer.innerHTML = innerhtml;
        } else {
          const categoryNotFound = document.createElement('h1');
          categoryNotFound.textContent = data.message;
          categoryNotFound.classList.add('category-not-found')
          postContainer.innerHTML = '';  // Clear any existing content
          postContainer.appendChild(categoryNotFound);  // Append the new element


        }
        console.log('response data', data.post_data)
      })
      .catch((err) => console.error(err));
  });

});

// FUNCTION CALLS
getUserDetail()
renderHomePosts()
cancelModal();

postContainer.addEventListener('click', deletePost)
