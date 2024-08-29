// Function to initialize the page
const initializePage = () => {
  // Selectors
  const feedback = document.querySelector(".feedback");
  const categories = document.querySelectorAll(".post-recommendation p");
  const postContainer = document.querySelector('.home-article');

  // Get query parameters
  const urlparam = new URLSearchParams(window.location.search);
  const login_message = urlparam.get("login_message");
  const post_message = urlparam.get("post_message");

  // Trim username from local storage
  let username = localStorage.getItem('username');
  if (username) {
    username = username.trim().replace(/^"|"$/g, ''); // trim spaces and remove quotes
  }

  // Check if feedback element is available and set messages
  if (feedback) {
    if (login_message) {
      feedback.children[1].textContent = login_message;
      feedback.style.visibility = "visible";
    } else if (post_message) {
      feedback.children[1].textContent = post_message;
      feedback.style.visibility = "visible";
    }
  } else {
    console.error("Feedback element is missing.");
  }

  // Function to remove a query parameter
  const removeQueryParam = (param) => {
    let url = new URL(window.location);
    let params = new URLSearchParams(url.search);
    params.delete(param);
    url.search = params.toString();
    window.history.replaceState({}, document.title, url.toString());
  };

  // Usage: Remove the 'post_message' query parameter
  removeQueryParam('post_message');

  // Function to get user details
  const getUserDetail = () => {
    const userDataElement = document.getElementById('current_user');
    if (userDataElement) {
      const currentUser = JSON.parse(userDataElement.textContent);
      localStorage.setItem('username', JSON.stringify(currentUser.username));
      localStorage.setItem('is_authenticated', JSON.stringify(currentUser.is_authenticated));
      localStorage.setItem('is_active', JSON.stringify(currentUser.is_active));
      localStorage.setItem('id', JSON.stringify(currentUser.id));
      localStorage.setItem('email', JSON.stringify(currentUser.email));
    } else {
      console.error("User data element is missing.");
    }
  };

  // Function to delete a post
  const deletePost = (e) => {
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
      e.preventDefault(); // Prevent default behavior if needed
      let deleteButton = e.target.closest('.delete-btn'); // Find the closest .delete-btn if clicked inside it
      let body = document.body;
      body.classList.add('modal-active');
      body.classList.add('overflow');
      document.querySelector('.delete-modal').classList.remove('hide-modal');
      let delete_url = deleteButton.getAttribute("data-post-id");
      let form = document.querySelector(".delete_form");
      if (form) {
        form.action = delete_url;
      }
    }
  };

  // Function to cancel the modal
  const cancelModal = () => {
    let cancelDeleteModal = document.querySelectorAll(".cancel-delete-modal");
    if (cancelDeleteModal.length) {
      cancelDeleteModal.forEach((element) => {
        element.addEventListener("click", () => {
          document.querySelector('.delete-modal').classList.toggle('hide-modal');
          document.body.classList.remove('modal-active');
          document.body.classList.remove('overflow');
        });
      });
    } else {
      console.error("Cancel delete modal elements are missing.");
    }
  };

  // Function to render home posts
  // Function to render home posts
  const renderHomePosts = () => {
    fetch(`/filter_posts`)
      .then((response) => {
        if (!response.ok) {
          // Handle non-200 responses
          return response.json().then((data) => {
            console.log(`Error ${response.status}: ${data.message}`);
            // You might want to show an error message in the UI
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.posts) {
          const all_posts = data.posts;
          let innerhtml = '';
          all_posts.forEach((post) => {
            const isOwner = post.author === username;
            innerhtml += `
                      <main class="home-main">
                        <div class="home-main-div">
                          <h4>${post.author}</h4>
                          <p>${post.created_at}</p>
                          <div class="new-post">
                            <p>new</p>
                          </div>
                        </div>
                        <div class="post-div">
                          <h1 id="title">${post.title}</h1>
                          <p id="content">${post.content}</p>
                        </div>
                        ${isOwner ? `
                        <div class="cta" style="display: flex;">
                          <a href="${post.edit_url}" class="edit-btn">
                            <i class="fas fa-edit"></i> Update
                          </a>
                          <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
                        </div>
                        ` : ''}
                      </main>`;
          });
          if (postContainer) {
            postContainer.innerHTML = innerhtml;
          } else {
            console.error("Post container is missing.");
          }
        }
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  };


  // REC// RECOMMENDATION
  categories.forEach((e) => {
    e.addEventListener("click", () => {
      let category = e.textContent;

      fetch(`/filter_posts?category=${encodeURIComponent(category)}`)
        .then((response) => {
          // Check if the response status is OK (status code 200)
          if (response.ok) {
            return response.json(); // Parse the response body as JSON
          } else {
            // Handle non-200 responses
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then((data) => {
          if (data.posts) {
            const all_posts = data.posts;
            let innerhtml = '';

            all_posts.forEach((post) => {
              const isOwner = post.author === username;
              innerhtml += `
              <main class="home-main">
                <div class="home-main-div">
                  <h4>${post.author}</h4>
                  <p>${post.created_at}</p>
                  <div class="new-post">
                    <p>new</p>
                  </div>
                </div>
                <div class="post-div">
                  <h1 id="title">${post.title}</h1>
                  <p id="content">${post.content}</p>
                </div>
                ${isOwner ? `
                <div class="cta" style="display: flex;">
                  <a href="${post.edit_url}" class="edit-btn">
                    <i class="fas fa-edit"></i> Update
                  </a>
                  <a data-post-id="${post.delete_url}" class="delete-btn"><i class="fas fa-trash-alt"></i> Delete</a>
                </div>
                ` : ''}
              </main>`;
            });

            if (postContainer) {
              postContainer.innerHTML = innerhtml;
            } else {
              console.error("Post container is missing.");
            }
          } else {
            const categoryNotFound = document.createElement('h1');
            categoryNotFound.textContent = data.message;
            categoryNotFound.classList.add('category-not-found');

            if (postContainer) {
              postContainer.innerHTML = '';  // Clear any existing content
              postContainer.appendChild(categoryNotFound);  // Append the new element
            }
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);

          // Handle unexpected errors
          if (postContainer) {
            postContainer.innerHTML = '<h1>An error occurred while fetching posts. Please try again later.</h1>';
            postContainer.classList.add('category-not-found');

          }
        });
    });
  });


  // FUNCTION CALLS
  getUserDetail();
  renderHomePosts();
  cancelModal();

  if (postContainer) {
    postContainer.addEventListener('click', deletePost);
  }
};

// Initialize the page after the DOM has fully loaded
document.addEventListener("DOMContentLoaded", initializePage);

