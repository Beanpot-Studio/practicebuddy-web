<template>
  <aside class="column is-2 aside">
    <nav class="menu">
      <ul class="menu-list">
        <li>
          <router-link class="navbar-item" :to="'studentlanding'">
            <i class="fas fa-users"></i> My Practices
          </router-link>
        </li>

        <li>
          <router-link class="navbar-item" :to="'settings'">
            <i class="fa fa-cog"></i> Settings
          </router-link>
        </li>

        <li>
          <a class>
            <i class="fa fa-user"></i> My Teacher
          </a>
        </li>

        <li>
          <router-link class="navbar-item" :to="''">
            <i class="fas fa-graduation-cap"></i> My Feedback
          </router-link>
        </li>
        <li>
          <router-link class="navbar-item" :to="''">
            <i class="fas fa-archive"></i> My Practice Archive
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>