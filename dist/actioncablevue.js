!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.ActionCableVue = e())
    : (t.ActionCableVue = e());
})("undefined" != typeof self ? self : this, function () {
  return (function (t) {
    var e = {};
    function n(o) {
      if (e[o]) return e[o].exports;
      var i = (e[o] = { i: o, l: !1, exports: {} });
      return t[o].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
    }
    return (
      (n.m = t),
      (n.c = e),
      (n.d = function (t, e, o) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
      }),
      (n.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (n.t = function (t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var o = Object.create(null);
        if (
          (n.r(o),
          Object.defineProperty(o, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var i in t)
            n.d(
              o,
              i,
              function (e) {
                return t[e];
              }.bind(null, i),
            );
        return o;
      }),
      (n.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return n.d(e, "a", e), e;
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ""),
      n((n.s = 1))
    );
  })([
    function (t, e, n) {
      !(function (t) {
        "use strict";
        var e = { logger: self.console, WebSocket: self.WebSocket },
          n = {
            log: function () {
              if (this.enabled) {
                for (
                  var t, n = arguments.length, o = Array(n), i = 0;
                  i < n;
                  i++
                )
                  o[i] = arguments[i];
                o.push(Date.now()),
                  (t = e.logger).log.apply(t, ["[ActionCable]"].concat(o));
              }
            },
          },
          o =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                },
          i = function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          },
          r = (function () {
            function t(t, e) {
              for (var n = 0; n < e.length; n++) {
                var o = e[n];
                (o.enumerable = o.enumerable || !1),
                  (o.configurable = !0),
                  "value" in o && (o.writable = !0),
                  Object.defineProperty(t, o.key, o);
              }
            }
            return function (e, n, o) {
              return n && t(e.prototype, n), o && t(e, o), e;
            };
          })(),
          c = function () {
            return new Date().getTime();
          },
          s = function (t) {
            return (c() - t) / 1e3;
          },
          l = (function () {
            function t(e) {
              i(this, t),
                (this.visibilityDidChange =
                  this.visibilityDidChange.bind(this)),
                (this.connection = e),
                (this.reconnectAttempts = 0);
            }
            return (
              (t.prototype.start = function () {
                this.isRunning() ||
                  ((this.startedAt = c()),
                  delete this.stoppedAt,
                  this.startPolling(),
                  addEventListener(
                    "visibilitychange",
                    this.visibilityDidChange,
                  ),
                  n.log(
                    "ConnectionMonitor started. pollInterval = " +
                      this.getPollInterval() +
                      " ms",
                  ));
              }),
              (t.prototype.stop = function () {
                this.isRunning() &&
                  ((this.stoppedAt = c()),
                  this.stopPolling(),
                  removeEventListener(
                    "visibilitychange",
                    this.visibilityDidChange,
                  ),
                  n.log("ConnectionMonitor stopped"));
              }),
              (t.prototype.isRunning = function () {
                return this.startedAt && !this.stoppedAt;
              }),
              (t.prototype.recordPing = function () {
                this.pingedAt = c();
              }),
              (t.prototype.recordConnect = function () {
                (this.reconnectAttempts = 0),
                  this.recordPing(),
                  delete this.disconnectedAt,
                  n.log("ConnectionMonitor recorded connect");
              }),
              (t.prototype.recordDisconnect = function () {
                (this.disconnectedAt = c()),
                  n.log("ConnectionMonitor recorded disconnect");
              }),
              (t.prototype.startPolling = function () {
                this.stopPolling(), this.poll();
              }),
              (t.prototype.stopPolling = function () {
                clearTimeout(this.pollTimeout);
              }),
              (t.prototype.poll = function () {
                var t = this;
                this.pollTimeout = setTimeout(function () {
                  t.reconnectIfStale(), t.poll();
                }, this.getPollInterval());
              }),
              (t.prototype.getPollInterval = function () {
                var t = this.constructor.pollInterval,
                  e = t.min,
                  n = t.max,
                  o = t.multiplier * Math.log(this.reconnectAttempts + 1);
                return Math.round(
                  1e3 *
                    (function (t, e, n) {
                      return Math.max(e, Math.min(n, t));
                    })(o, e, n),
                );
              }),
              (t.prototype.reconnectIfStale = function () {
                this.connectionIsStale() &&
                  (n.log(
                    "ConnectionMonitor detected stale connection. reconnectAttempts = " +
                      this.reconnectAttempts +
                      ", pollInterval = " +
                      this.getPollInterval() +
                      " ms, time disconnected = " +
                      s(this.disconnectedAt) +
                      " s, stale threshold = " +
                      this.constructor.staleThreshold +
                      " s",
                  ),
                  this.reconnectAttempts++,
                  this.disconnectedRecently()
                    ? n.log(
                        "ConnectionMonitor skipping reopening recent disconnect",
                      )
                    : (n.log("ConnectionMonitor reopening"),
                      this.connection.reopen()));
              }),
              (t.prototype.connectionIsStale = function () {
                return (
                  s(this.pingedAt ? this.pingedAt : this.startedAt) >
                  this.constructor.staleThreshold
                );
              }),
              (t.prototype.disconnectedRecently = function () {
                return (
                  this.disconnectedAt &&
                  s(this.disconnectedAt) < this.constructor.staleThreshold
                );
              }),
              (t.prototype.visibilityDidChange = function () {
                var t = this;
                "visible" === document.visibilityState &&
                  setTimeout(function () {
                    (!t.connectionIsStale() && t.connection.isOpen()) ||
                      (n.log(
                        "ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " +
                          document.visibilityState,
                      ),
                      t.connection.reopen());
                  }, 200);
              }),
              t
            );
          })();
        (l.pollInterval = { min: 3, max: 30, multiplier: 5 }),
          (l.staleThreshold = 6);
        var u = {
            message_types: {
              welcome: "welcome",
              disconnect: "disconnect",
              ping: "ping",
              confirmation: "confirm_subscription",
              rejection: "reject_subscription",
            },
            disconnect_reasons: {
              unauthorized: "unauthorized",
              invalid_request: "invalid_request",
              server_restart: "server_restart",
            },
            default_mount_path: "/cable",
            protocols: ["actioncable-v1-json", "actioncable-unsupported"],
          },
          a = u.message_types,
          h = u.protocols,
          f = h.slice(0, h.length - 1),
          p = [].indexOf,
          d = (function () {
            function t(e) {
              i(this, t),
                (this.open = this.open.bind(this)),
                (this.consumer = e),
                (this.subscriptions = this.consumer.subscriptions),
                (this.monitor = new l(this)),
                (this.disconnected = !0);
            }
            return (
              (t.prototype.send = function (t) {
                return (
                  !!this.isOpen() &&
                  (this.webSocket.send(JSON.stringify(t)), !0)
                );
              }),
              (t.prototype.open = function () {
                return this.isActive()
                  ? (n.log(
                      "Attempted to open WebSocket, but existing socket is " +
                        this.getState(),
                    ),
                    !1)
                  : (n.log(
                      "Opening WebSocket, current state is " +
                        this.getState() +
                        ", subprotocols: " +
                        h,
                    ),
                    this.webSocket && this.uninstallEventHandlers(),
                    (this.webSocket = new e.WebSocket(this.consumer.url, h)),
                    this.installEventHandlers(),
                    this.monitor.start(),
                    !0);
              }),
              (t.prototype.close = function () {
                var t =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : { allowReconnect: !0 },
                  e = t.allowReconnect;
                if ((e || this.monitor.stop(), this.isActive()))
                  return this.webSocket.close();
              }),
              (t.prototype.reopen = function () {
                if (
                  (n.log(
                    "Reopening WebSocket, current state is " + this.getState(),
                  ),
                  !this.isActive())
                )
                  return this.open();
                try {
                  return this.close();
                } catch (t) {
                  n.log("Failed to reopen WebSocket", t);
                } finally {
                  n.log(
                    "Reopening WebSocket in " +
                      this.constructor.reopenDelay +
                      "ms",
                  ),
                    setTimeout(this.open, this.constructor.reopenDelay);
                }
              }),
              (t.prototype.getProtocol = function () {
                if (this.webSocket) return this.webSocket.protocol;
              }),
              (t.prototype.isOpen = function () {
                return this.isState("open");
              }),
              (t.prototype.isActive = function () {
                return this.isState("open", "connecting");
              }),
              (t.prototype.isProtocolSupported = function () {
                return p.call(f, this.getProtocol()) >= 0;
              }),
              (t.prototype.isState = function () {
                for (var t = arguments.length, e = Array(t), n = 0; n < t; n++)
                  e[n] = arguments[n];
                return p.call(e, this.getState()) >= 0;
              }),
              (t.prototype.getState = function () {
                if (this.webSocket)
                  for (var t in e.WebSocket)
                    if (e.WebSocket[t] === this.webSocket.readyState)
                      return t.toLowerCase();
                return null;
              }),
              (t.prototype.installEventHandlers = function () {
                for (var t in this.events) {
                  var e = this.events[t].bind(this);
                  this.webSocket["on" + t] = e;
                }
              }),
              (t.prototype.uninstallEventHandlers = function () {
                for (var t in this.events)
                  this.webSocket["on" + t] = function () {};
              }),
              t
            );
          })();
        (d.reopenDelay = 500),
          (d.prototype.events = {
            message: function (t) {
              if (this.isProtocolSupported()) {
                var e = JSON.parse(t.data),
                  o = e.identifier,
                  i = e.message,
                  r = e.reason,
                  c = e.reconnect;
                switch (e.type) {
                  case a.welcome:
                    return (
                      this.monitor.recordConnect(), this.subscriptions.reload()
                    );
                  case a.disconnect:
                    return (
                      n.log("Disconnecting. Reason: " + r),
                      this.close({ allowReconnect: c })
                    );
                  case a.ping:
                    return this.monitor.recordPing();
                  case a.confirmation:
                    return this.subscriptions.notify(o, "connected");
                  case a.rejection:
                    return this.subscriptions.reject(o);
                  default:
                    return this.subscriptions.notify(o, "received", i);
                }
              }
            },
            open: function () {
              if (
                (n.log(
                  "WebSocket onopen event, using '" +
                    this.getProtocol() +
                    "' subprotocol",
                ),
                (this.disconnected = !1),
                !this.isProtocolSupported())
              )
                return (
                  n.log(
                    "Protocol is unsupported. Stopping monitor and disconnecting.",
                  ),
                  this.close({ allowReconnect: !1 })
                );
            },
            close: function (t) {
              if ((n.log("WebSocket onclose event"), !this.disconnected))
                return (
                  (this.disconnected = !0),
                  this.monitor.recordDisconnect(),
                  this.subscriptions.notifyAll("disconnected", {
                    willAttemptReconnect: this.monitor.isRunning(),
                  })
                );
            },
            error: function () {
              n.log("WebSocket onerror event");
            },
          });
        var b = function (t, e) {
            if (null != e)
              for (var n in e) {
                var o = e[n];
                t[n] = o;
              }
            return t;
          },
          y = (function () {
            function t(e) {
              var n =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                o = arguments[2];
              i(this, t),
                (this.consumer = e),
                (this.identifier = JSON.stringify(n)),
                b(this, o);
            }
            return (
              (t.prototype.perform = function (t) {
                var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
                return (e.action = t), this.send(e);
              }),
              (t.prototype.send = function (t) {
                return this.consumer.send({
                  command: "message",
                  identifier: this.identifier,
                  data: JSON.stringify(t),
                });
              }),
              (t.prototype.unsubscribe = function () {
                return this.consumer.subscriptions.remove(this);
              }),
              t
            );
          })(),
          g = (function () {
            function t(e) {
              i(this, t), (this.consumer = e), (this.subscriptions = []);
            }
            return (
              (t.prototype.create = function (t, e) {
                var n = t,
                  i =
                    "object" === (void 0 === n ? "undefined" : o(n))
                      ? n
                      : { channel: n },
                  r = new y(this.consumer, i, e);
                return this.add(r);
              }),
              (t.prototype.add = function (t) {
                return (
                  this.subscriptions.push(t),
                  this.consumer.ensureActiveConnection(),
                  this.notify(t, "initialized"),
                  this.sendCommand(t, "subscribe"),
                  t
                );
              }),
              (t.prototype.remove = function (t) {
                return (
                  this.forget(t),
                  this.findAll(t.identifier).length ||
                    this.sendCommand(t, "unsubscribe"),
                  t
                );
              }),
              (t.prototype.reject = function (t) {
                var e = this;
                return this.findAll(t).map(function (t) {
                  return e.forget(t), e.notify(t, "rejected"), t;
                });
              }),
              (t.prototype.forget = function (t) {
                return (
                  (this.subscriptions = this.subscriptions.filter(function (e) {
                    return e !== t;
                  })),
                  t
                );
              }),
              (t.prototype.findAll = function (t) {
                return this.subscriptions.filter(function (e) {
                  return e.identifier === t;
                });
              }),
              (t.prototype.reload = function () {
                var t = this;
                return this.subscriptions.map(function (e) {
                  return t.sendCommand(e, "subscribe");
                });
              }),
              (t.prototype.notifyAll = function (t) {
                for (
                  var e = this,
                    n = arguments.length,
                    o = Array(n > 1 ? n - 1 : 0),
                    i = 1;
                  i < n;
                  i++
                )
                  o[i - 1] = arguments[i];
                return this.subscriptions.map(function (n) {
                  return e.notify.apply(e, [n, t].concat(o));
                });
              }),
              (t.prototype.notify = function (t, e) {
                for (
                  var n = arguments.length, o = Array(n > 2 ? n - 2 : 0), i = 2;
                  i < n;
                  i++
                )
                  o[i - 2] = arguments[i];
                return ("string" == typeof t ? this.findAll(t) : [t]).map(
                  function (t) {
                    return "function" == typeof t[e]
                      ? t[e].apply(t, o)
                      : void 0;
                  },
                );
              }),
              (t.prototype.sendCommand = function (t, e) {
                var n = t.identifier;
                return this.consumer.send({ command: e, identifier: n });
              }),
              t
            );
          })(),
          v = (function () {
            function t(e) {
              i(this, t),
                (this._url = e),
                (this.subscriptions = new g(this)),
                (this.connection = new d(this));
            }
            return (
              (t.prototype.send = function (t) {
                return this.connection.send(t);
              }),
              (t.prototype.connect = function () {
                return this.connection.open();
              }),
              (t.prototype.disconnect = function () {
                return this.connection.close({ allowReconnect: !1 });
              }),
              (t.prototype.ensureActiveConnection = function () {
                if (!this.connection.isActive()) return this.connection.open();
              }),
              r(t, [
                {
                  key: "url",
                  get: function () {
                    return m(this._url);
                  },
                },
              ]),
              t
            );
          })();
        function m(t) {
          if (("function" == typeof t && (t = t()), t && !/^wss?:/i.test(t))) {
            var e = document.createElement("a");
            return (
              (e.href = t),
              (e.href = e.href),
              (e.protocol = e.protocol.replace("http", "ws")),
              e.href
            );
          }
          return t;
        }
        function _(t) {
          var e = document.head.querySelector(
            "meta[name='action-cable-" + t + "']",
          );
          if (e) return e.getAttribute("content");
        }
        (t.Connection = d),
          (t.ConnectionMonitor = l),
          (t.Consumer = v),
          (t.INTERNAL = u),
          (t.Subscription = y),
          (t.Subscriptions = g),
          (t.adapters = e),
          (t.createWebSocketURL = m),
          (t.logger = n),
          (t.createConsumer = function () {
            var t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : _("url") || u.default_mount_path;
            return new v(t);
          }),
          (t.getConfig = _),
          Object.defineProperty(t, "__esModule", { value: !0 });
      })(e);
    },
    function (t, e, n) {
      t.exports = n(2);
    },
    function (t, e, n) {
      "use strict";
      n.r(e);
      var o = n(0);
      function i(t, e) {
        for (var n = 0; n < e.length; n++) {
          var o = e[n];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            "value" in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function r(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      var c = (function () {
        function t(e, n) {
          !(function (t, e) {
            if (!(t instanceof e))
              throw new TypeError("Cannot call a class as a function");
          })(this, t),
            r(this, "_debug", void 0),
            r(this, "_debugLevel", void 0),
            (this._debug = e),
            (this._debugLevel = n);
        }
        var e, n, o;
        return (
          (e = t),
          (n = [
            {
              key: "log",
              value: function (t) {
                var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "error";
                this._debug &&
                  ("all" == this._debugLevel || e == this._debugLevel) &&
                  console.log(t);
              },
            },
          ]) && i(e.prototype, n),
          o && i(e, o),
          t
        );
      })();
      function s(t) {
        return (s =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              })(t);
      }
      var l = function () {
        var t, e, n, o;
        Object.keys ||
          (Object.keys =
            ((t = Object.prototype.hasOwnProperty),
            (e = !{ toString: null }.propertyIsEnumerable("toString")),
            (o = (n = [
              "toString",
              "toLocaleString",
              "valueOf",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "constructor",
            ]).length),
            function (i) {
              if ("function" != typeof i && ("object" !== s(i) || null === i))
                throw new TypeError("Object.keys called on non-object");
              var r,
                c,
                l = [];
              for (r in i) t.call(i, r) && l.push(r);
              if (e) for (c = 0; c < o; c++) t.call(i, n[c]) && l.push(n[c]);
              return l;
            })),
          Object.entries ||
            (Object.entries = function (t) {
              for (
                var e = Object.keys(t), n = e.length, o = new Array(n);
                n--;

              )
                o[n] = [e[n], t[e[n]]];
              return o;
            });
      };
      function u(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(t);
          e &&
            (o = o.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, o);
        }
        return n;
      }
      function a(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? u(Object(n), !0).forEach(function (e) {
                h(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : u(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e),
                );
              });
        }
        return t;
      }
      function h(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      function f(t) {
        if (t.$options.channels || t.channels)
          for (
            var e = t.channels || t.$options.channels,
              n = Object.entries(e),
              o = 0;
            o < n.length;
            o++
          ) {
            var i = n[o];
            if ("computed" != i[0]) t.$cable._removeChannel(i[0], t._uid);
            else
              i[1].forEach(function (e) {
                var n = e.channelName.call(t);
                t.$cable._removeChannel(n, t._uid);
              });
          }
      }
      var p = {
        created: function () {
          var t = this;
          if (this.$options.channels || this.channels) {
            l();
            for (
              var e = this.channels || this.$options.channels,
                n = Object.entries(e),
                o = 0;
              o < n.length;
              o++
            ) {
              var i = n[o];
              if ("computed" != i[0])
                this.$cable._addChannel(i[0], a({}, i[1]), this);
              else
                i[1].forEach(function (e) {
                  var n = e.channelName.call(t),
                    o = {
                      connected: e.connected,
                      rejected: e.rejected,
                      disconnected: e.disconnected,
                      received: e.received,
                    };
                  t.$cable._addChannel(n, o, t);
                });
            }
          }
        },
        beforeUnmount: function () {
          f(this);
        },
        beforeDestroy: function () {
          f(this);
        },
      };
      function d(t, e) {
        for (var n = 0; n < e.length; n++) {
          var o = e[n];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            "value" in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function b(t, e, n) {
        return (
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      var y = (function () {
          function t(e, n) {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              b(this, "_logger", null),
              b(this, "_cable", null),
              b(this, "_channels", { subscriptions: {} }),
              b(this, "_contexts", {}),
              b(this, "_connectionUrl", null),
              3 === Number(e.version.split(".")[0])
                ? (e.config.globalProperties.$cable = this)
                : (e.prototype.$cable = this),
              e.mixin(p);
            var o = n || {
                debug: !1,
                debugLevel: "error",
                connectionUrl: null,
                store: null,
              },
              i = o.debug,
              r = o.debugLevel,
              s = o.connectionUrl,
              l = o.connectImmediately,
              u = o.store;
            (this._connectionUrl = s),
              !1 !== l && (l = !0),
              u && (u.$cable = this),
              (this._logger = new c(i, r)),
              l && this._connect(this._connectionUrl),
              this._attachConnectionObject();
          }
          var e, n, i;
          return (
            (e = t),
            (n = [
              {
                key: "subscribe",
                value: function (t, e) {
                  var n = this;
                  if (this._cable) {
                    var o = e || t.channel;
                    this._channels.subscriptions[o] =
                      this._cable.subscriptions.create(t, {
                        connected: function () {
                          n._fireChannelEvent(o, n._channelConnected);
                        },
                        disconnected: function () {
                          n._fireChannelEvent(o, n._channelDisconnected);
                        },
                        rejected: function () {
                          n._fireChannelEvent(o, n._subscriptionRejected);
                        },
                        received: function (t) {
                          n._fireChannelEvent(o, n._channelReceived, t);
                        },
                      });
                  } else
                    this._connect(this._connectionUrl), this.subscribe(t, e);
                },
              },
              {
                key: "perform",
                value: function (t) {
                  var e = t.channel,
                    n = t.action,
                    o = t.data;
                  this._logger.log(
                    "Performing action '"
                      .concat(n, "' on channel '")
                      .concat(e, "'."),
                    "info",
                  );
                  var i = this._channels.subscriptions[e];
                  if (!i)
                    throw new Error(
                      "You need to be subscribed to perform action '"
                        .concat(n, "' on channel '")
                        .concat(e, "'."),
                    );
                  i.perform(n, o),
                    this._logger.log(
                      "Performed '".concat(n, "' on channel '").concat(e, "'."),
                      "info",
                    );
                },
              },
              {
                key: "unsubscribe",
                value: function (t) {
                  this._channels.subscriptions[t] &&
                    (this._channels.subscriptions[t].unsubscribe(),
                    this._logger.log(
                      "Unsubscribed from channel '".concat(t, "'."),
                      "info",
                    ));
                },
              },
              {
                key: "_channelConnected",
                value: function (t) {
                  t.connected &&
                    t.connected.call(this._contexts[t._uid].context),
                    this._logger.log(
                      "Successfully connected to channel '".concat(
                        t._name,
                        "'.",
                      ),
                      "info",
                    );
                },
              },
              {
                key: "_channelDisconnected",
                value: function (t) {
                  t.disconnected &&
                    t.disconnected.call(this._contexts[t._uid].context),
                    this._logger.log(
                      "Successfully disconnected from channel '".concat(
                        t._name,
                        "'.",
                      ),
                      "info",
                    );
                },
              },
              {
                key: "_subscriptionRejected",
                value: function (t) {
                  t.rejected && t.rejected.call(this._contexts[t._uid].context),
                    this._logger.log(
                      "Subscription rejected for channel '".concat(
                        t._name,
                        "'.",
                      ),
                    );
                },
              },
              {
                key: "_channelReceived",
                value: function (t, e) {
                  t.received &&
                    t.received.call(this._contexts[t._uid].context, e),
                    this._logger.log(
                      "Message received on channel '".concat(t._name, "'."),
                      "info",
                    );
                },
              },
              {
                key: "_connect",
                value: function (t) {
                  this._cable =
                    "function" == typeof t
                      ? Object(o.createConsumer)(t())
                      : Object(o.createConsumer)(t);
                },
              },
              {
                key: "_attachConnectionObject",
                value: function () {
                  var t = this;
                  this.connection = {
                    connect: function () {
                      var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : null;
                      t._cable
                        ? (e && (t._connectionUrl = e), t._cable.connect())
                        : (e && (t._connectionUrl = e),
                          t._connect(e || t._connectionUrl));
                    },
                    disconnect: function () {
                      t._cable && t._cable.disconnect();
                    },
                  };
                },
              },
              {
                key: "_addChannel",
                value: function (t, e, n) {
                  (e._uid = n._uid),
                    (e._name = t),
                    this._channels[t] || (this._channels[t] = []),
                    this._addContext(n),
                    !this._channels[t].find(function (t) {
                      return t._uid == n._uid;
                    }) &&
                      this._contexts[n._uid] &&
                      this._channels[t].push(e);
                },
              },
              {
                key: "_addContext",
                value: function (t) {
                  this._contexts[t._uid] = { context: t };
                },
              },
              {
                key: "_removeChannel",
                value: function (t, e) {
                  this._channels[t] &&
                    (this._channels[t].splice(
                      this._channels[t].findIndex(function (t) {
                        return t._uid == e;
                      }),
                      1,
                    ),
                    delete this._contexts[e],
                    0 == this._channels[t].length &&
                      this._channels.subscriptions[t] &&
                      (this._channels.subscriptions[t].unsubscribe(),
                      delete this._channels.subscriptions[t]),
                    this._logger.log(
                      "Unsubscribed from channel '".concat(t, "'."),
                      "info",
                    ));
                },
              },
              {
                key: "_fireChannelEvent",
                value: function (t, e, n) {
                  if (this._channels.hasOwnProperty(t))
                    for (var o = this._channels[t], i = 0; i < o.length; i++)
                      e.call(this, o[i], n);
                },
              },
            ]) && d(e.prototype, n),
            i && d(e, i),
            t
          );
        })(),
        g = {
          install: function (t, e) {
            new y(t, e);
          },
        };
      e.default = g;
    },
  ]).default;
});
