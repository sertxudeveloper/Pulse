<template>
  <nav class="h-100">
    <ul class="nav flex-column text-center">
      <li class="nav-item py-3">
        <router-link to="/" class="nav-link text-light active" href="#" data-toggle="tooltip" data-placement="right"
          title="Home">
          <i class="fas fa-star"></i>
        </router-link>
      </li>
      <li class="nav-item py-3">
        <router-link to="/songs" class="nav-link text-light" href="#" data-toggle="tooltip" data-placement="right"
          title="Songs">
          <i class="fas fa-music"></i>
        </router-link>
      </li>
      <li class="nav-item py-3">
        <router-link to="/albums" class="nav-link text-light" href="#" data-toggle="tooltip" data-placement="right"
          title="Albums">
          <i class="fas fa-compact-disc"></i>
        </router-link>
      </li>
      <li class="nav-item py-3">
        <router-link to="/artists" class="nav-link text-light" href="#" data-toggle="tooltip" data-placement="right"
          title="Artists">
          <i class="fas fa-users"></i>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style>

</style>
