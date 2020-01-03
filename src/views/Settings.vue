<template>
  <div class="settings">
    <div class="hero">
      <div class="hero-body">
        <h1 class="title has-text-centered is-size-3">Student Settings</h1>
        <div class="columns is-centered">
          <div class="column is-half">
            <div class="notification is-light">
              <div class="field">
                <label class="label">Name</label>
                <p class="control has-icons-left has-icons-right">
                  <input class="input" type="email" placeholder="Email" />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <label class="label">Password:</label>
                <p class="control has-icons-left">
                  <input class="input" type="password" placeholder="Password" />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <a class="button is-info is-rounded is-medium">Save</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
