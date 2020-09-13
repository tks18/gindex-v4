<template>
  <table class="table is-hoverable">
    <thead>
      <tr style="border-bottom: 1px solid white">
        <th
          v-for="(column, index) in columns"
          v-bind:key="index"
          :class="column.class"
          :style="column.style"
        >
          {{ column.name }}
          <span @click="sortIt(column.orig_name)" class="caret-wrapper">
            <i class="sort-caret ascending"></i>
            <i class="sort-caret descending"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <td>
        <div class="field has-addons is-grouped">
          <div class="control is-expanded is-dark">
            <input class="input is-expanded fillsearch" type="search" v-tooltip.bottom-start="'Filter the List'" v-model="searchBarTerm" placeholder="Filter the Files..">
          </div>
        </div>
      </td>
      <tr class="tr-item" v-for="(file, index) in files" v-bind:key="index">
        <td
          class="td-item"
          @click.self="
            action(
              file,
              file.mimeType !== 'application/vnd.google-apps.folder'
                ? 'view'
                : ''
            )
          "
          :title="file.name"
        >
        <svg class="iconfont" aria-hidden="true">
          <use :xlink:href="icons(file.mimeType)" />
        </svg>
          {{ file.name }}
          <span
            class="g2-file-desc"
            v-if="isShowDesc"
            @click.self="
              action(
                file,
                file.mimeType !== 'application/vnd.google-apps.folder'
                  ? 'view'
                  : ''
              )
            "
            v-html="file.description"
            style="color: #bbf1c8;"
          ></span>
        </td>
        <td class="td-item is-hidden-mobile is-hidden-touch">
          {{ file.modifiedTime }}
        </td>
        <td class="td-item is-hidden-mobile is-hidden-touch">{{ file.size }}</td>
        <td class="is-hidden-mobile is-hidden-touch">
          <span class="icon td-hover" v-if="file.mimeType !== 'application/vnd.google-apps.folder'" @click.stop="action(file,'copy')">
            <i
              class="fa fa-copy faa-shake animated-hover"
              :title="$t('list.opt.copy')"
              aria-hidden="true"
            ></i>
          </span>
          <span class="icon td-hover" @click.stop="action(file, '_blank')">
            <i
              class="fa fa-external-link faa-shake animated-hover"
              :title="$t('list.opt.newTab')"
              aria-hidden="true"
            ></i>
          </span>
          <span
            class="icon td-hover"
            @click.stop="action(file, 'down')"
            v-if="file.mimeType !== 'application/vnd.google-apps.folder'"
          >
            <i
              class="fa fa-download faa-shake animated-hover"
              aria-hidden="true"
              :title="$t('list.opt.download')"
            ></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    originalData: {
      type: Array,
      default: () => [],
    },
    icons: {
      type: Function,
    },
    action: {
      type: Function,
    },
    sortIt: {
      type: Function,
    }
  },
  data: function(){
    return {
      searchBarTerm: "",
    }
  },
  computed: {
    files(){
      if(this.searchBarTerm.length > 0){
        const searchRegex = new RegExp(this.searchBarTerm.toLowerCase());
        return this.originalData.filter((file) => {
          return searchRegex.test(file.name.toLowerCase());
        });
      } else {
        return this.data;
      }
    },
    columns() {
      return [
        { name: this.$t("list.title.file"), style: "color: white;", orig_name: "name" },
        {
          name: this.$t("list.title.moditime"),
          style: "width:20%;color: white;",
          class: "is-hidden-mobile is-hidden-touch",
          orig_name: "modifiedTime"
        },
        {
          name: this.$t("list.title.size"),
          style: "width:10.5%;color: white;",
          class: "is-hidden-mobile is-hidden-touch",
          orig_name: "absoluteSize",
        },
        {
          name: this.$t("list.title.operation"),
          style: "width:13.5%;color: white;",
          class: "is-hidden-mobile is-hidden-touch",
          orig_name: "name"
        },
      ];
    },
    isShowDesc() {
      return window.themeOptions.render.desc || false;
    },
  },
};
</script>
