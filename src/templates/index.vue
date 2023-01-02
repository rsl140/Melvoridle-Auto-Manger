<template>
  <div class="x-bank-items-box">
    <div
      class="row row-deck"
      style="
        max-height: 60vh;
        overflow: auto;
        padding: 1.25rem 1.25rem;
        box-sizing: border-box;
      "
    >
      <!-- <div class="col-12">
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            {{ select }}
          </button>
          <div class="dropdown-menu" style="max-height: 40vh; overflow: auto;">
            <div v-for="(items, key) in listMap" :key="key">
              <h6 class="dropdown-header">{{ key }}</h6>
              <a v-for="item in items" :key="item.id" class="dropdown-item" href="#" @click="handleClick(item)">
                {{ item.name }}
              </a>
              <div class="dropdown-divider"></div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Sign in</button>
        </div>
      </div> -->
      <div class="col-12 col-md-6 col-lg-6 col-xl-4">
        <div v-for="(items, key) in listMap" :key="key">
          <div class="col-12 col-md-6 col-lg-6 col-xl-4">
            <label>{{ key }}</label>
          </div>
          <div class="col-12 col-md-6 col-lg-6 col-xl-4">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                {{ (selectObj[key] && selectObj[key].name) || "select" }}
              </button>
              <div class="dropdown-menu">
                <a
                  v-for="item in items"
                  :key="item.id"
                  class="dropdown-item"
                  href="#"
                  @click="handleClick(key, item)"
                  >{{ item.name }}</a
                >
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-6 col-xl-4">
            <div class="input-group mb-3">
              <input type="number" :id="`${key}-input`" class="form-control" placeholder="100" />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  @click="handleAdd(key)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>