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
          <span class="caret-wrapper">
            <i class="sort-caret ascending"></i>
            <i class="sort-caret descending"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="tr-item" v-for="(file, index) in data" v-bind:key="index">
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
        <td @click.self="
          action(
            file,
            file.mimeType !== 'application/vnd.google-apps.folder'
              ? 'view'
              : ''
          )
        " class="td-item is-hidden-mobile is-hidden-touch">
          {{ file.modifiedTime }}
        </td>
        <td @click.self="
          action(
            file,
            file.mimeType !== 'application/vnd.google-apps.folder'
              ? 'view'
              : ''
          )
        " class="td-item is-hidden-mobile is-hidden-touch">{{ file.size }}</td>
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
    icons: {
      type: Function,
    },
    action: {
      type: Function,
    },
  },
  computed: {
    columns() {
      return [
        { name: this.$t("list.title.file"), style: "color: white;" },
        {
          name: this.$t("list.title.moditime"),
          style: "width:20%;color: white;",
          class: "is-hidden-mobile is-hidden-touch",
        },
        {
          name: this.$t("list.title.size"),
          style: "width:10.5%;color: white;",
          class: "is-hidden-mobile is-hidden-touch",
        },
      ];
    },
    isShowDesc() {
      return window.themeOptions.render.desc || false;
    },
  },
};
</script>
