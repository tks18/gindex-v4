<template>
  <!-- eslint-disable vue/no-v-html -->
  <table class="table is-hoverable">
    <thead>
      <tr style="border-bottom: 1px solid white">
        <th
          v-for="(column, index) in columns"
          :key="index"
          :class="column.class"
          :style="column.style"
        >
          {{ column.name }}
          <span class="caret-wrapper" @click="sortIt(column.orig_name)">
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
            <input
              v-model="searchBarTerm"
              v-tooltip.bottom-start="'Filter the List'"
              class="input is-expanded fillsearch"
              type="search"
              placeholder="Filter the Files.."
            />
          </div>
        </div>
      </td>
      <tr v-for="(file, index) in files" :key="index" class="tr-item">
        <td
          class="td-item"
          :title="file.name"
          @click.self="
            action(
              file,
              file.mimeType !== 'application/vnd.google-apps.folder'
                ? 'view'
                : '',
            )
          "
        >
          <svg class="iconfont" aria-hidden="true">
            <use :xlink:href="icons(file.mimeType)" />
          </svg>
          {{ file.name }}
          <span
            v-if="isShowDesc"
            class="g2-file-desc"
            style="color: #bbf1c8"
            @click.self="
              action(
                file,
                file.mimeType !== 'application/vnd.google-apps.folder'
                  ? 'view'
                  : '',
              )
            "
            v-html="file.description"
          ></span>
        </td>
        <td class="td-item is-hidden-mobile is-hidden-touch">
          {{ file.modifiedTime }}
        </td>
        <td class="td-item is-hidden-mobile is-hidden-touch">
          {{ file.size }}
        </td>
        <td class="is-hidden-mobile is-hidden-touch">
          <button
            v-if="file.mimeType !== 'application/vnd.google-apps.folder'"
            class="button icon td-hover is-rounded is-netflix-red has-text-white"
            icon
            small
            @click.stop="action(file, 'copy')"
          >
            <i class="fa fa-copy" title="Copy" aria-hidden="true"></i>
          </button>
          <button
            class="button icon td-hover is-rounded is-netflix-red has-text-white"
            icon
            small
            @click.stop="action(file, '_blank')"
          >
            <i
              class="fa fa-external-link"
              title="New Tab"
              aria-hidden="true"
            ></i>
          </button>
          <button
            v-if="file.mimeType !== 'application/vnd.google-apps.folder'"
            class="button icon td-hover is-rounded is-netflix-red has-text-white"
            icon
            small
            @click.stop="action(file, 'down')"
          >
            <i class="fa fa-download" aria-hidden="true" title="Download"></i>
          </button>
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
      default: () => [],
    },
    action: {
      type: Function,
      default: () => [],
    },
    sortIt: {
      type: Function,
      default: () => [],
    },
  },
  data() {
    return {
      searchBarTerm: '',
    };
  },
  computed: {
    files() {
      if (this.searchBarTerm.length > 0) {
        const searchRegex = new RegExp(this.searchBarTerm.toLowerCase());
        const returnVal = this.originalData.filter((file) => {
          const regexTest = file.name.toLowerCase();
          return searchRegex.test(regexTest);
        });
        return returnVal;
      }
      return this.data;
    },
    columns() {
      return [
        { name: 'File', style: 'color: white;', orig_name: 'name' },
        {
          name: 'Modified Time',
          style: 'width:20%;color: white;',
          class: 'is-hidden-mobile is-hidden-touch',
          orig_name: 'modifiedTime',
        },
        {
          name: 'Size',
          style: 'width:10.5%;color: white;',
          class: 'is-hidden-mobile is-hidden-touch',
          orig_name: 'absoluteSize',
        },
        {
          name: 'Actions',
          style: 'width:13.5%;color: white;',
          class: 'is-hidden-mobile is-hidden-touch',
          orig_name: 'name',
        },
      ];
    },
    isShowDesc() {
      return window.themeOptions.render.desc || false;
    },
  },
};
</script>
