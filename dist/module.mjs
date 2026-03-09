import { defineNuxtModule as n, createResolver as a, addComponent as t, addImports as o, addPlugin as m } from "@nuxt/kit";
const l = n({
  meta: {
    name: "notiv",
    configKey: "notiv",
    compatibility: { nuxt: ">=3.0.0" }
  },
  defaults: { css: !0 },
  setup(e, i) {
    const { resolve: s } = a(import.meta.url);
    t({
      name: "NotivToaster",
      export: "NotivToaster",
      filePath: "notiv",
      mode: "client"
    }), t({
      name: "NotivToast",
      export: "NotivToast",
      filePath: "notiv",
      mode: "client"
    }), o({
      name: "useNotiv",
      as: "useNotiv",
      from: "notiv"
    }), o({
      name: "notiv",
      as: "notiv",
      from: "notiv"
    }), m({
      src: s("./runtime/plugin"),
      mode: "client"
    }), e.css !== !1 && i.options.css.push("notiv/style.css");
  }
});
export {
  l as default
};
