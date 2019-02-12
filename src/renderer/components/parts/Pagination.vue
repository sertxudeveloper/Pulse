<template>
  <ul class="pagination justify-content-center">
    <li class="page-item" :class="pagination.current_page <= 1 ? 'disabled' : ''">
      <span aria-hidden="true" class="page-link px-0" v-on:click="changePage(pagination.current_page - 1)">
        <i class="fas fa-chevron-left"></i>
      </span>
    </li>
    <li class="page-item" :class="isCurrentPage(page) ? 'active' : ''" v-for="page in pages">
      <span class="page-link px-0" v-on:click="changePage(page)">{{ page }}</span>
    </li>
    <li class="page-item" :class="pagination.current_page >= pagination.last_page ? 'disabled' : ''">
      <span aria-hidden="true" class="page-link px-0" v-on:click="changePage(pagination.current_page + 1)">
        <i class="fas fa-chevron-right"></i>
      </span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['pagination', 'offset'],
    methods: {
      isCurrentPage (page) {
        return this.pagination.current_page === page
      },
      changePage (page) {
        if (page > this.pagination.last_page) {
          page = this.pagination.last_page
        }

        this.$emit('changePage', page)
      }
    },
    computed: {
      pages () {
        let pages = []
        let from = this.pagination.current_page - Math.floor(this.offset / 2)
        if (from < 1) {
          from = 1
        }
        let to = from + this.offset - 1
        if (to > this.pagination.last_page) {
          to = this.pagination.last_page
        }
        while (from <= to) {
          pages.push(from)
          from++
        }
        return pages
      }
    }
  }
</script>

<style scoped>
  li {
    margin: 5px;
  }

  li span {
    height: 40px;
    min-width: 40px;
    font-size: 17px;
    line-height: 20px;
    text-align: center;
    background-color: transparent !important;
    color: #fff;
  }

  li span i {
    font-size: 13px;
  }

  .disabled {
    display: none;
  }

  .active {
    background-color: var(--primary);
  }

  .page-link:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
</style>
