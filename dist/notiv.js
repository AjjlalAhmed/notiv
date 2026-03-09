import { reactive as ne, ref as _, onUnmounted as H, openBlock as f, createElementBlock as p, createElementVNode as d, createStaticVNode as oe, defineComponent as Ft, computed as r, onMounted as Q, watch as k, watchPostEffect as ae, nextTick as $t, normalizeStyle as dt, unref as b, createCommentVNode as G, normalizeClass as F, createBlock as tt, resolveDynamicComponent as Ct, toDisplayString as J, createTextVNode as ie, Teleport as se, Fragment as ct, renderList as Pt } from "vue";
const T = 40, j = 350, le = 16, re = 420, N = 6e3, ue = N * 0.1, ce = N * 0.025, de = N - 2e3, ve = 0.5, Nt = 10, fe = 2.25, he = 200, me = re * 0.7;
let pe = 0;
const Rt = () => `${++pe}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, u = ne({
  toasts: [],
  position: "top-right",
  options: void 0
});
function ge(t, n) {
  if (t.autopilot === !1 || !n || n <= 0) return {};
  const e = typeof t.autopilot == "object" ? t.autopilot : void 0, a = (i) => Math.min(n, Math.max(0, i));
  return {
    expandDelayMs: a((e == null ? void 0 : e.expand) ?? ce),
    collapseDelayMs: a((e == null ? void 0 : e.collapse) ?? de)
  };
}
function ye(t) {
  var n;
  return {
    ...u.options,
    ...t,
    styles: { ...(n = u.options) == null ? void 0 : n.styles, ...t.styles }
  };
}
function Ht(t, n, e) {
  const a = ye(t), i = a.duration !== void 0 ? a.duration : N, l = ge(a, i);
  return {
    ...a,
    id: n,
    instanceId: Rt(),
    state: a.state ?? a.type,
    position: a.position ?? e ?? u.position,
    autoExpandDelayMs: l.expandDelayMs,
    autoCollapseDelayMs: l.collapseDelayMs
  };
}
function E(t) {
  const n = t.id ?? Rt(), e = u.toasts.find((i) => i.id === n && !i._removing), a = Ht(t, n, e == null ? void 0 : e.position);
  if (e) {
    const i = u.toasts.indexOf(e);
    u.toasts.splice(i, 1, a);
  } else {
    const i = u.toasts.findIndex((l) => l.id === n);
    i !== -1 && u.toasts.splice(i, 1), u.toasts.push(a);
  }
  return n;
}
function Ot(t, n) {
  const e = u.toasts.find((l) => l.id === t);
  if (!e) return;
  const a = Ht({ ...e, ...n }, t, e.position), i = u.toasts.indexOf(e);
  u.toasts.splice(i, 1, a);
}
function et(t) {
  const n = u.toasts.find((e) => e.id === t);
  !n || n._removing || (n._removing = !0, setTimeout(() => {
    const e = u.toasts.findIndex((a) => a.id === t);
    e !== -1 && u.toasts.splice(e, 1);
  }, ue));
}
function xe(t) {
  (t ? u.toasts.filter((e) => (e.position ?? u.position) === t) : [...u.toasts]).forEach((e) => et(e.id));
}
const _e = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
], we = 35, Te = 1, Lt = 1 / 120, ke = 0.064, Bt = 0.5;
function R(t) {
  const n = _(t);
  let e = t, a = 0, i = t, l, x = 0;
  function D(m) {
    const A = x ? Math.min((m - x) / 1e3, ke) : Lt;
    x = m;
    let M = A;
    for (; M > 0; ) {
      const y = Math.min(M, Lt), S = -400 * (e - i) - we * a;
      a += S / Te * y, e += a * y, M -= y;
    }
    n.value = e;
    const I = e - i;
    if (Math.abs(I) < Bt && Math.abs(a) < Bt) {
      e = i, a = 0, n.value = i, l = void 0, x = 0;
      return;
    }
    l = requestAnimationFrame(D);
  }
  function O(m, A = !1) {
    if (i = m, A) {
      l !== void 0 && (cancelAnimationFrame(l), l = void 0), e = m, a = 0, n.value = m, x = 0;
      return;
    }
    l === void 0 && (x = 0, l = requestAnimationFrame(D));
  }
  return H(() => {
    l !== void 0 && cancelAnimationFrame(l);
  }), { value: n, set: O };
}
const W = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [a, i] of n)
    e[a] = i;
  return e;
}, Me = {}, be = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Ae(t, n) {
  return f(), p("svg", be, [...n[0] || (n[0] = [
    d("path", { d: "M20 6 9 17l-5-5" }, null, -1)
  ])]);
}
const Ie = /* @__PURE__ */ W(Me, [["render", Ae]]), Ee = {}, De = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Se(t, n) {
  return f(), p("svg", De, [...n[0] || (n[0] = [
    d("path", { d: "M18 6 6 18" }, null, -1),
    d("path", { d: "m6 6 12 12" }, null, -1)
  ])]);
}
const $e = /* @__PURE__ */ W(Ee, [["render", Se]]), Ce = {}, Pe = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Ne(t, n) {
  return f(), p("svg", Pe, [...n[0] || (n[0] = [
    d("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }, null, -1),
    d("line", {
      x1: "12",
      x2: "12",
      y1: "8",
      y2: "12"
    }, null, -1),
    d("line", {
      x1: "12",
      x2: "12.01",
      y1: "16",
      y2: "16"
    }, null, -1)
  ])]);
}
const Oe = /* @__PURE__ */ W(Ce, [["render", Ne]]), Le = {}, Be = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "data-notiv-icon": "spin",
  "aria-hidden": "true"
};
function Fe(t, n) {
  return f(), p("svg", Be, [...n[0] || (n[0] = [
    d("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }, null, -1)
  ])]);
}
const Re = /* @__PURE__ */ W(Le, [["render", Fe]]), He = {}, We = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Ue(t, n) {
  return f(), p("svg", We, [...n[0] || (n[0] = [
    oe('<circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle>', 6)
  ])]);
}
const Xe = /* @__PURE__ */ W(He, [["render", Ue]]), je = {}, Ge = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
};
function Ye(t, n) {
  return f(), p("svg", Ge, [...n[0] || (n[0] = [
    d("path", { d: "M5 12h14" }, null, -1),
    d("path", { d: "m12 5 7 7-7 7" }, null, -1)
  ])]);
}
const ze = /* @__PURE__ */ W(je, [["render", Ye]]), Ve = ["data-ready", "data-expanded", "data-exiting", "data-edge", "data-position", "data-state"], qe = ["data-edge"], Ke = ["width", "height", "viewBox"], Ze = ["id"], Je = ["stdDeviation"], Qe = ["x", "width", "height", "rx", "ry", "fill"], tn = ["y", "width", "height", "rx", "ry", "fill", "opacity"], en = ["data-edge"], nn = { "data-notiv-header-stack": "" }, on = ["data-transitioning"], an = ["data-state"], sn = ["data-state"], ln = ["data-state"], rn = ["data-state"], un = ["data-edge", "data-visible"], cn = ["data-state"], dn = 30, vn = 20, Wt = /* @__PURE__ */ Ft({
  __name: "NotivToast",
  props: {
    toast: {},
    pillAlign: {},
    expand: {},
    canExpand: { type: Boolean },
    defaultFill: {}
  },
  emits: ["mouseenter", "mouseleave"],
  setup(t, { emit: n }) {
    const e = t, a = n, i = r(() => e.toast.state ?? e.toast.type ?? "info"), l = r(() => e.toast.fill ?? e.defaultFill ?? "#1a1a1a"), x = r(() => Math.max(0, e.toast.roundness ?? le)), D = r(() => x.value * ve), O = r(() => `notiv-goo-${e.toast.id}`), m = r(() => !!e.toast.description || !!e.toast.button), A = r(() => i.value === "loading"), M = r(
      () => e.toast.duration !== void 0 ? e.toast.duration : N
    ), I = _(!1);
    Q(() => {
      requestAnimationFrame(() => {
        I.value = !0;
      });
    });
    const y = _(!1), w = r(() => m.value && y.value && !A.value), S = r(() => `${i.value}-${e.toast.title ?? ""}`), s = _({
      key: S.value,
      state: i.value,
      title: e.toast.title ?? i.value,
      icon: e.toast.icon,
      styles: e.toast.styles
    }), v = _(null);
    let c = null;
    k(S, () => {
      v.value = { ...s.value }, s.value = {
        key: S.value,
        state: i.value,
        title: e.toast.title ?? i.value,
        icon: e.toast.icon,
        styles: e.toast.styles
      }, c && clearTimeout(c), c = setTimeout(() => {
        v.value = null, c = null;
      }, me);
    });
    const g = _(null), $ = _(null), vt = _(0);
    let U = null, nt = null, ot = 0;
    function at() {
      const o = g.value, h = $.value;
      if (!o || !h) return;
      if (nt === null) {
        const P = getComputedStyle(h);
        nt = parseFloat(P.paddingLeft) + parseFloat(P.paddingRight);
      }
      const C = o.scrollWidth + (nt ?? 0) + Nt;
      C > Nt && (vt.value = C);
    }
    ae(() => {
      s.value.key, $t(at);
    }), Q(() => {
      at(), g.value && (U = new ResizeObserver(() => {
        cancelAnimationFrame(ot), ot = requestAnimationFrame(at);
      }), U.observe(g.value));
    }), H(() => {
      cancelAnimationFrame(ot), U == null || U.disconnect(), c && clearTimeout(c);
    });
    const Y = _(null), it = _(0);
    let L = null, st = 0;
    function ft() {
      const o = Y.value;
      o && (it.value = o.scrollHeight);
    }
    k(m, async (o) => {
      if (!o) {
        it.value = 0;
        return;
      }
      await $t(), ft(), Y.value && !L && (L = new ResizeObserver(() => {
        cancelAnimationFrame(st), st = requestAnimationFrame(ft);
      }), L.observe(Y.value));
    }, { immediate: !0 }), H(() => {
      cancelAnimationFrame(st), L == null || L.disconnect();
    });
    const lt = T * fe, rt = r(() => Math.max(vt.value || T, T)), Xt = r(() => T + D.value * 3), z = r(() => Math.max(lt, T + it.value)), jt = r(() => Math.max(0, z.value - T)), ht = _(lt);
    k(w, (o) => {
      o && (ht.value = z.value);
    });
    const mt = r(() => {
      const o = rt.value;
      return e.pillAlign === "right" ? j - o : e.pillAlign === "center" ? (j - o) / 2 : 0;
    }), pt = r(() => rt.value), Gt = r(() => w.value ? Xt.value : T), Yt = r(() => w.value ? jt.value : 0), zt = r(() => w.value ? 1 : 0), Vt = r(() => e.toast._removing ? 0 : w.value ? z.value : T), ut = R(mt.value), gt = R(pt.value), yt = R(T), xt = R(0), _t = R(0), wt = R(T);
    k(mt, (o) => ut.set(o, !I.value)), k(pt, (o) => gt.set(o, !I.value)), k(Gt, (o) => yt.set(o)), k(Yt, (o) => xt.set(o)), k(zt, (o) => _t.set(o)), k(Vt, (o) => wt.set(o));
    const Tt = r(
      () => m.value ? Math.max(w.value ? z.value : ht.value, lt) : T
    ), qt = r(() => ({
      "--_h": `${wt.value.value}px`,
      "--_pw": `${rt.value}px`,
      "--_px": `${ut.value.value}px`,
      "--_ht": "translateZ(0)",
      "--_co": `${w.value ? 1 : 0}`
    }));
    let V = null, q = null;
    function kt() {
      V && clearTimeout(V), q && clearTimeout(q), V = q = null;
    }
    k(
      [() => e.toast.instanceId, () => e.toast.autoExpandDelayMs, () => e.toast.autoCollapseDelayMs, () => e.canExpand, () => e.toast._removing],
      () => {
        if (kt(), !m.value || A.value || !e.canExpand || e.toast._removing) {
          y.value = !1;
          return;
        }
        const { autoExpandDelayMs: o, autoCollapseDelayMs: h } = e.toast;
        o == null && h == null || (o != null && o > 0 ? V = setTimeout(() => {
          y.value = !0;
        }, o) : o === 0 && (y.value = !0), h != null && h > 0 && (q = setTimeout(() => {
          y.value = !1;
        }, h)));
      },
      { immediate: !0 }
    ), H(kt);
    let K = null;
    function Mt() {
      M.value === null || M.value <= 0 || (K = setTimeout(() => et(e.toast.id), M.value));
    }
    function bt() {
      K && clearTimeout(K), K = null;
    }
    Q(Mt), H(bt);
    let Z = null;
    k(() => e.toast.instanceId, () => {
      Z && clearTimeout(Z), w.value && (y.value = !1, Z = setTimeout(() => {
        Z = null;
      }, he));
    });
    function Kt() {
      a("mouseenter"), bt(), m.value && !A.value && (y.value = !0);
    }
    function Zt() {
      a("mouseleave"), Mt(), y.value = !1;
    }
    const X = _(null);
    let B = null;
    function Jt(o) {
      e.toast._removing || o.target.closest("[data-notiv-button]") || (B = o.clientY, o.currentTarget.setPointerCapture(o.pointerId));
    }
    function Qt(o) {
      if (B === null || !X.value) return;
      const h = o.clientY - B, C = h > 0 ? 1 : -1, P = Math.min(Math.abs(h), vn) * C;
      X.value.style.transform = `translateY(${P}px)`;
    }
    function te(o) {
      if (B === null || !X.value) return;
      const h = o.clientY - B;
      B = null, X.value.style.transform = "", Math.abs(h) > dn && et(e.toast.id);
    }
    const At = {
      success: Ie,
      error: $e,
      warning: Oe,
      loading: Re,
      info: Xe,
      action: ze
    };
    function ee(o) {
      var h;
      o.preventDefault(), o.stopPropagation(), (h = e.toast.button) == null || h.onClick();
    }
    return (o, h) => {
      var C, P, It, Et, Dt, St;
      return f(), p("button", {
        ref_key: "buttonRef",
        ref: X,
        type: "button",
        "data-notiv-toast": "",
        "data-ready": I.value,
        "data-expanded": w.value,
        "data-exiting": t.toast._removing || void 0,
        "data-edge": t.expand,
        "data-position": t.pillAlign,
        "data-state": i.value,
        style: dt(qt.value),
        onMouseenter: Kt,
        onMouseleave: Zt,
        onPointerdown: Jt,
        onPointermove: Qt,
        onPointerup: te
      }, [
        d("div", {
          "data-notiv-canvas": "",
          "data-edge": t.expand,
          style: dt({ filter: `url(#${O.value})` })
        }, [
          (f(), p("svg", {
            "data-notiv-svg": "",
            width: b(j),
            height: Tt.value,
            viewBox: `0 0 ${b(j)} ${Tt.value}`,
            "aria-hidden": "true",
            style: { overflow: "visible" }
          }, [
            d("defs", null, [
              d("filter", {
                id: O.value,
                x: "-20%",
                y: "-20%",
                width: "140%",
                height: "140%",
                "color-interpolation-filters": "sRGB"
              }, [
                d("feGaussianBlur", {
                  in: "SourceGraphic",
                  stdDeviation: D.value,
                  result: "blur"
                }, null, 8, Je),
                h[0] || (h[0] = d("feColorMatrix", {
                  in: "blur",
                  mode: "matrix",
                  values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10",
                  result: "goo"
                }, null, -1)),
                h[1] || (h[1] = d("feComposite", {
                  in: "SourceGraphic",
                  in2: "goo",
                  operator: "atop"
                }, null, -1))
              ], 8, Ze)
            ]),
            d("rect", {
              "data-notiv-pill": "",
              x: b(ut).value.value,
              width: b(gt).value.value,
              height: b(yt).value.value,
              rx: x.value,
              ry: x.value,
              fill: l.value
            }, null, 8, Qe),
            m.value ? (f(), p("rect", {
              key: 0,
              "data-notiv-body": "",
              x: 0,
              y: b(T),
              width: b(j),
              height: b(xt).value.value,
              rx: x.value,
              ry: x.value,
              fill: l.value,
              opacity: b(_t).value.value
            }, null, 8, tn)) : G("", !0)
          ], 8, Ke))
        ], 12, qe),
        d("div", {
          ref_key: "headerRef",
          ref: $,
          "data-notiv-header": "",
          "data-edge": t.expand
        }, [
          d("div", nn, [
            (f(), p("div", {
              ref_key: "innerRef",
              ref: g,
              key: s.value.key,
              "data-notiv-header-inner": "",
              "data-layer": "current",
              "data-transitioning": v.value ? !0 : void 0
            }, [
              d("div", {
                "data-notiv-badge": "",
                "data-state": s.value.state,
                class: F((C = s.value.styles) == null ? void 0 : C.badge)
              }, [
                (f(), tt(Ct(t.toast.icon ?? At[s.value.state])))
              ], 10, an),
              d("span", {
                "data-notiv-title": "",
                "data-state": s.value.state,
                class: F((P = s.value.styles) == null ? void 0 : P.title)
              }, J(s.value.title), 11, sn)
            ], 8, on)),
            v.value ? (f(), p("div", {
              key: v.value.key,
              "data-notiv-header-inner": "",
              "data-layer": "prev",
              "data-exiting": "true"
            }, [
              d("div", {
                "data-notiv-badge": "",
                "data-state": v.value.state,
                class: F((It = v.value.styles) == null ? void 0 : It.badge)
              }, [
                (f(), tt(Ct(t.toast.icon ?? At[v.value.state])))
              ], 10, ln),
              d("span", {
                "data-notiv-title": "",
                "data-state": v.value.state,
                class: F((Et = v.value.styles) == null ? void 0 : Et.title)
              }, J(v.value.title), 11, rn)
            ])) : G("", !0)
          ])
        ], 8, en),
        m.value ? (f(), p("div", {
          key: 0,
          "data-notiv-content": "",
          "data-edge": t.expand,
          "data-visible": w.value || void 0
        }, [
          d("div", {
            ref_key: "contentRef",
            ref: Y,
            "data-notiv-description": "",
            class: F((Dt = t.toast.styles) == null ? void 0 : Dt.description)
          }, [
            ie(J(t.toast.description) + " ", 1),
            t.toast.button ? (f(), p("a", {
              key: 0,
              href: "#",
              "data-notiv-button": "",
              "data-state": i.value,
              class: F((St = t.toast.styles) == null ? void 0 : St.button),
              onClick: ee
            }, J(t.toast.button.title), 11, cn)) : G("", !0)
          ], 2)
        ], 8, un)) : G("", !0)
      ], 44, Ve);
    };
  }
}), fn = ["data-position", "data-theme"], hn = /* @__PURE__ */ Ft({
  __name: "NotivToaster",
  props: {
    position: { default: "top-right" },
    offset: {},
    options: {},
    theme: { default: "system" }
  },
  setup(t) {
    const n = t, e = {
      light: "#1a1a1a",
      dark: "#f2f2f2"
    }, a = _("light");
    function i() {
      return n.theme === "light" || n.theme === "dark" ? n.theme : typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    let l = null;
    Q(() => {
      if (a.value = i(), n.theme === "system") {
        l = window.matchMedia("(prefers-color-scheme: dark)");
        const s = (v) => {
          a.value = v.matches ? "dark" : "light";
        };
        l.addEventListener("change", s), H(() => l == null ? void 0 : l.removeEventListener("change", s));
      }
    }), k(() => n.theme, () => {
      a.value = i();
    });
    const x = r(
      () => n.theme ? e[a.value] : void 0
    );
    function D(s) {
      return s.includes("right") ? "right" : s.includes("center") ? "center" : "left";
    }
    function O(s) {
      return s.startsWith("top") ? "bottom" : "top";
    }
    function m(s) {
      return u.toasts.filter((v) => (v.position ?? n.position) === s);
    }
    function A(s) {
      if (n.offset === void 0) return {};
      const v = ($) => typeof $ == "number" ? `${$}px` : $, c = typeof n.offset == "object" ? n.offset : { top: n.offset, right: n.offset, bottom: n.offset, left: n.offset }, g = {};
      return s.startsWith("top") && c.top != null && (g.top = v(c.top)), s.startsWith("bottom") && c.bottom != null && (g.bottom = v(c.bottom)), s.endsWith("left") && c.left != null && (g.left = v(c.left)), s.endsWith("right") && c.right != null && (g.right = v(c.right)), g;
    }
    const M = _(void 0), I = r(() => {
      for (let s = u.toasts.length - 1; s >= 0; s--)
        if (!u.toasts[s]._removing) return u.toasts[s].id;
    }), y = r(() => M.value ?? I.value);
    function w(s) {
      M.value = s;
    }
    function S() {
      M.value = I.value;
    }
    return (s, v) => (f(), tt(se, { to: "body" }, [
      (f(!0), p(ct, null, Pt(b(_e), (c) => (f(), p(ct, { key: c }, [
        m(c).length > 0 ? (f(), p("section", {
          key: 0,
          "data-notiv-viewport": "",
          "data-position": c,
          "data-theme": t.theme ? a.value : void 0,
          "aria-live": "polite",
          "aria-atomic": "false",
          style: dt(A(c))
        }, [
          (f(!0), p(ct, null, Pt(m(c), (g) => (f(), tt(Wt, {
            key: g.id,
            toast: g,
            "pill-align": D(c),
            expand: O(c),
            "can-expand": y.value === void 0 || y.value === g.id,
            "default-fill": g.fill ?? x.value,
            onMouseenter: ($) => w(g.id),
            onMouseleave: S
          }, null, 8, ["toast", "pill-align", "expand", "can-expand", "default-fill", "onMouseenter"]))), 128))
        ], 12, fn)) : G("", !0)
      ], 64))), 128))
    ]));
  }
}), Ut = {
  show(t) {
    return E({ ...t, state: t.type });
  },
  success(t) {
    return E({ ...t, state: "success" });
  },
  error(t) {
    return E({ ...t, state: "error" });
  },
  warning(t) {
    return E({ ...t, state: "warning" });
  },
  info(t) {
    return E({ ...t, state: "info" });
  },
  action(t) {
    return E({ ...t, state: "action" });
  },
  loading(t) {
    return E({ ...t, state: "loading", duration: null });
  },
  promise(t, n) {
    const e = E({
      ...n.loading,
      state: "loading",
      duration: null,
      position: n.position
    }), a = typeof t == "function" ? t() : t;
    return a.then((i) => {
      const l = typeof n.success == "function" ? n.success(i) : n.success;
      Ot(e, {
        ...l,
        id: e,
        state: "success",
        duration: l.duration ?? N
      });
    }).catch((i) => {
      const l = typeof n.error == "function" ? n.error(i) : n.error;
      Ot(e, {
        ...l,
        id: e,
        state: "error",
        duration: l.duration ?? N
      });
    }), a;
  },
  dismiss(t) {
    et(t);
  },
  clear(t) {
    xe(t);
  }
};
function pn(t) {
  const n = r(
    () => t ? u.toasts.filter((e) => (e.position ?? "top-right") === t) : u.toasts
  );
  return { notiv: Ut, toasts: n };
}
const gn = {
  install(t) {
    t.component("NotivToaster", hn), t.component("NotivToast", Wt), t.config.globalProperties.$notiv = Ut;
  }
};
export {
  gn as NotivPlugin,
  Wt as NotivToast,
  hn as NotivToaster,
  gn as default,
  Ut as notiv,
  pn as useNotiv
};
