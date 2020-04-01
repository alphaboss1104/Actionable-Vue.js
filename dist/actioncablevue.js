!(function (t, n) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define([], n)
    : "object" == typeof exports
    ? (exports.ActionCableVue = n())
    : (t.ActionCableVue = n());
})("undefined" != typeof self ? self : this, function () {
  return (function (t) {
    var n = {};
    function e(o) {
      if (n[o]) return n[o].exports;
      var i = (n[o] = { i: o, l: !1, exports: {} });
      return t[o].call(i.exports, i, i.exports, e), (i.l = !0), i.exports;
    }
    return (
      (e.m = t),
      (e.c = n),
      (e.d = function (t, n, o) {
        e.o(t, n) || Object.defineProperty(t, n, { enumerable: !0, get: o });
      }),
      (e.r = function (t) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (e.t = function (t, n) {
        if ((1 & n && (t = e(t)), 8 & n)) return t;
        if (4 & n && "object" == typeof t && t && t.__esModule) return t;
        var o = Object.create(null);
        if (
          (e.r(o),
          Object.defineProperty(o, "default", { enumerable: !0, value: t }),
          2 & n && "string" != typeof t)
        )
          for (var i in t)
            e.d(
              o,
              i,
              function (n) {
                return t[n];
              }.bind(null, i)
            );
        return o;
      }),
      (e.n = function (t) {
        var n =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return e.d(n, "a", n), n;
      }),
      (e.o = function (t, n) {
        return Object.prototype.hasOwnProperty.call(t, n);
      }),
      (e.p = ""),
      e((e.s = 1))
    );
  })([
    function (t, n, e) {
      var o, i;
      (function () {
        (function () {
          (function () {
            var t = [].slice;
            this.ActionCable = {
              INTERNAL: {
                message_types: {
                  welcome: "welcome",
                  ping: "ping",
                  confirmation: "confirm_subscription",
                  rejection: "reject_subscription",
                },
                default_mount_path: "/cable",
                protocols: ["actioncable-v1-json", "actioncable-unsupported"],
              },
              WebSocket: window.WebSocket,
              logger: window.console,
              createConsumer: function (t) {
                var n;
                return (
                  null == t &&
                    (t =
                      null != (n = this.getConfig("url"))
                        ? n
                        : this.INTERNAL.default_mount_path),
                  new r.Consumer(this.createWebSocketURL(t))
                );
              },
              getConfig: function (t) {
                var n;
                return null !=
                  (n = document.head.querySelector(
                    "meta[name='action-cable-" + t + "']"
                  ))
                  ? n.getAttribute("content")
                  : void 0;
              },
              createWebSocketURL: function (t) {
                var n;
                return t && !/^wss?:/i.test(t)
                  ? (((n = document.createElement("a")).href = t),
                    (n.href = n.href),
                    (n.protocol = n.protocol.replace("http", "ws")),
                    n.href)
                  : t;
              },
              startDebugging: function () {
                return (this.debugging = !0);
              },
              stopDebugging: function () {
                return (this.debugging = null);
              },
              log: function () {
                var n, e;
                if (
                  ((n = 1 <= arguments.length ? t.call(arguments, 0) : []),
                  this.debugging)
                )
                  return (
                    n.push(Date.now()),
                    (e = this.logger).log.apply(
                      e,
                      ["[ActionCable]"].concat(t.call(n))
                    )
                  );
              },
            };
          }.call(this));
        }.call(this));
        var r = this.ActionCable;
        (function () {
          (function () {
            r.ConnectionMonitor = (function () {
              var t, n, e;
              function o(t) {
                var n, e;
                (this.connection = t),
                  (this.visibilityDidChange =
                    ((n = this.visibilityDidChange),
                    (e = this),
                    function () {
                      return n.apply(e, arguments);
                    })),
                  (this.reconnectAttempts = 0);
              }
              return (
                (o.pollInterval = { min: 3, max: 30 }),
                (o.staleThreshold = 6),
                (o.prototype.start = function () {
                  if (!this.isRunning())
                    return (
                      (this.startedAt = n()),
                      delete this.stoppedAt,
                      this.startPolling(),
                      document.addEventListener(
                        "visibilitychange",
                        this.visibilityDidChange
                      ),
                      r.log(
                        "ConnectionMonitor started. pollInterval = " +
                          this.getPollInterval() +
                          " ms"
                      )
                    );
                }),
                (o.prototype.stop = function () {
                  if (this.isRunning())
                    return (
                      (this.stoppedAt = n()),
                      this.stopPolling(),
                      document.removeEventListener(
                        "visibilitychange",
                        this.visibilityDidChange
                      ),
                      r.log("ConnectionMonitor stopped")
                    );
                }),
                (o.prototype.isRunning = function () {
                  return null != this.startedAt && null == this.stoppedAt;
                }),
                (o.prototype.recordPing = function () {
                  return (this.pingedAt = n());
                }),
                (o.prototype.recordConnect = function () {
                  return (
                    (this.reconnectAttempts = 0),
                    this.recordPing(),
                    delete this.disconnectedAt,
                    r.log("ConnectionMonitor recorded connect")
                  );
                }),
                (o.prototype.recordDisconnect = function () {
                  return (
                    (this.disconnectedAt = n()),
                    r.log("ConnectionMonitor recorded disconnect")
                  );
                }),
                (o.prototype.startPolling = function () {
                  return this.stopPolling(), this.poll();
                }),
                (o.prototype.stopPolling = function () {
                  return clearTimeout(this.pollTimeout);
                }),
                (o.prototype.poll = function () {
                  return (this.pollTimeout = setTimeout(
                    ((t = this),
                    function () {
                      return t.reconnectIfStale(), t.poll();
                    }),
                    this.getPollInterval()
                  ));
                  var t;
                }),
                (o.prototype.getPollInterval = function () {
                  var n, e, o, i;
                  return (
                    (o = (i = this.constructor.pollInterval).min),
                    (e = i.max),
                    (n = 5 * Math.log(this.reconnectAttempts + 1)),
                    Math.round(1e3 * t(n, o, e))
                  );
                }),
                (o.prototype.reconnectIfStale = function () {
                  if (this.connectionIsStale())
                    return (
                      r.log(
                        "ConnectionMonitor detected stale connection. reconnectAttempts = " +
                          this.reconnectAttempts +
                          ", pollInterval = " +
                          this.getPollInterval() +
                          " ms, time disconnected = " +
                          e(this.disconnectedAt) +
                          " s, stale threshold = " +
                          this.constructor.staleThreshold +
                          " s"
                      ),
                      this.reconnectAttempts++,
                      this.disconnectedRecently()
                        ? r.log(
                            "ConnectionMonitor skipping reopening recent disconnect"
                          )
                        : (r.log("ConnectionMonitor reopening"),
                          this.connection.reopen())
                    );
                }),
                (o.prototype.connectionIsStale = function () {
                  var t;
                  return (
                    e(null != (t = this.pingedAt) ? t : this.startedAt) >
                    this.constructor.staleThreshold
                  );
                }),
                (o.prototype.disconnectedRecently = function () {
                  return (
                    this.disconnectedAt &&
                    e(this.disconnectedAt) < this.constructor.staleThreshold
                  );
                }),
                (o.prototype.visibilityDidChange = function () {
                  if ("visible" === document.visibilityState)
                    return setTimeout(
                      ((t = this),
                      function () {
                        if (t.connectionIsStale() || !t.connection.isOpen())
                          return (
                            r.log(
                              "ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " +
                                document.visibilityState
                            ),
                            t.connection.reopen()
                          );
                      }),
                      200
                    );
                  var t;
                }),
                (n = function () {
                  return new Date().getTime();
                }),
                (e = function (t) {
                  return (n() - t) / 1e3;
                }),
                (t = function (t, n, e) {
                  return Math.max(n, Math.min(e, t));
                }),
                o
              );
            })();
          }.call(this),
            function () {
              var t,
                n,
                e,
                o,
                i,
                c = [].slice,
                s =
                  [].indexOf ||
                  function (t) {
                    for (var n = 0, e = this.length; n < e; n++)
                      if (n in this && this[n] === t) return n;
                    return -1;
                  };
              (o = r.INTERNAL),
                (n = o.message_types),
                (e = o.protocols),
                (i =
                  2 <= e.length
                    ? c.call(e, 0, (t = e.length - 1))
                    : ((t = 0), [])),
                e[t++],
                (r.Connection = (function () {
                  function t(t) {
                    var n, e;
                    (this.consumer = t),
                      (this.open =
                        ((n = this.open),
                        (e = this),
                        function () {
                          return n.apply(e, arguments);
                        })),
                      (this.subscriptions = this.consumer.subscriptions),
                      (this.monitor = new r.ConnectionMonitor(this)),
                      (this.disconnected = !0);
                  }
                  return (
                    (t.reopenDelay = 500),
                    (t.prototype.send = function (t) {
                      return (
                        !!this.isOpen() &&
                        (this.webSocket.send(JSON.stringify(t)), !0)
                      );
                    }),
                    (t.prototype.open = function () {
                      return this.isActive()
                        ? (r.log(
                            "Attempted to open WebSocket, but existing socket is " +
                              this.getState()
                          ),
                          !1)
                        : (r.log(
                            "Opening WebSocket, current state is " +
                              this.getState() +
                              ", subprotocols: " +
                              e
                          ),
                          null != this.webSocket &&
                            this.uninstallEventHandlers(),
                          (this.webSocket = new r.WebSocket(
                            this.consumer.url,
                            e
                          )),
                          this.installEventHandlers(),
                          this.monitor.start(),
                          !0);
                    }),
                    (t.prototype.close = function (t) {
                      var n;
                      if (
                        ((null != t ? t : { allowReconnect: !0 })
                          .allowReconnect || this.monitor.stop(),
                        this.isActive())
                      )
                        return null != (n = this.webSocket)
                          ? n.close()
                          : void 0;
                    }),
                    (t.prototype.reopen = function () {
                      var t;
                      if (
                        (r.log(
                          "Reopening WebSocket, current state is " +
                            this.getState()
                        ),
                        !this.isActive())
                      )
                        return this.open();
                      try {
                        return this.close();
                      } catch (n) {
                        return (t = n), r.log("Failed to reopen WebSocket", t);
                      } finally {
                        r.log(
                          "Reopening WebSocket in " +
                            this.constructor.reopenDelay +
                            "ms"
                        ),
                          setTimeout(this.open, this.constructor.reopenDelay);
                      }
                    }),
                    (t.prototype.getProtocol = function () {
                      var t;
                      return null != (t = this.webSocket) ? t.protocol : void 0;
                    }),
                    (t.prototype.isOpen = function () {
                      return this.isState("open");
                    }),
                    (t.prototype.isActive = function () {
                      return this.isState("open", "connecting");
                    }),
                    (t.prototype.isProtocolSupported = function () {
                      var t;
                      return (t = this.getProtocol()), s.call(i, t) >= 0;
                    }),
                    (t.prototype.isState = function () {
                      var t, n;
                      return (
                        (n = 1 <= arguments.length ? c.call(arguments, 0) : []),
                        (t = this.getState()),
                        s.call(n, t) >= 0
                      );
                    }),
                    (t.prototype.getState = function () {
                      var t, n;
                      for (n in WebSocket)
                        if (
                          WebSocket[n] ===
                          (null != (t = this.webSocket) ? t.readyState : void 0)
                        )
                          return n.toLowerCase();
                      return null;
                    }),
                    (t.prototype.installEventHandlers = function () {
                      var t, n;
                      for (t in this.events)
                        (n = this.events[t].bind(this)),
                          (this.webSocket["on" + t] = n);
                    }),
                    (t.prototype.uninstallEventHandlers = function () {
                      var t;
                      for (t in this.events)
                        this.webSocket["on" + t] = function () {};
                    }),
                    (t.prototype.events = {
                      message: function (t) {
                        var e, o, i;
                        if (this.isProtocolSupported())
                          switch (
                            ((e = (i = JSON.parse(t.data)).identifier),
                            (o = i.message),
                            i.type)
                          ) {
                            case n.welcome:
                              return (
                                this.monitor.recordConnect(),
                                this.subscriptions.reload()
                              );
                            case n.ping:
                              return this.monitor.recordPing();
                            case n.confirmation:
                              return this.subscriptions.notify(e, "connected");
                            case n.rejection:
                              return this.subscriptions.reject(e);
                            default:
                              return this.subscriptions.notify(
                                e,
                                "received",
                                o
                              );
                          }
                      },
                      open: function () {
                        if (
                          (r.log(
                            "WebSocket onopen event, using '" +
                              this.getProtocol() +
                              "' subprotocol"
                          ),
                          (this.disconnected = !1),
                          !this.isProtocolSupported())
                        )
                          return (
                            r.log(
                              "Protocol is unsupported. Stopping monitor and disconnecting."
                            ),
                            this.close({ allowReconnect: !1 })
                          );
                      },
                      close: function (t) {
                        if (
                          (r.log("WebSocket onclose event"), !this.disconnected)
                        )
                          return (
                            (this.disconnected = !0),
                            this.monitor.recordDisconnect(),
                            this.subscriptions.notifyAll("disconnected", {
                              willAttemptReconnect: this.monitor.isRunning(),
                            })
                          );
                      },
                      error: function () {
                        return r.log("WebSocket onerror event");
                      },
                    }),
                    t
                  );
                })());
            }.call(this),
            function () {
              var t = [].slice;
              r.Subscriptions = (function () {
                function n(t) {
                  (this.consumer = t), (this.subscriptions = []);
                }
                return (
                  (n.prototype.create = function (t, n) {
                    var e, o, i;
                    return (
                      (o = "object" == typeof (e = t) ? e : { channel: e }),
                      (i = new r.Subscription(this.consumer, o, n)),
                      this.add(i)
                    );
                  }),
                  (n.prototype.add = function (t) {
                    return (
                      this.subscriptions.push(t),
                      this.consumer.ensureActiveConnection(),
                      this.notify(t, "initialized"),
                      this.sendCommand(t, "subscribe"),
                      t
                    );
                  }),
                  (n.prototype.remove = function (t) {
                    return (
                      this.forget(t),
                      this.findAll(t.identifier).length ||
                        this.sendCommand(t, "unsubscribe"),
                      t
                    );
                  }),
                  (n.prototype.reject = function (t) {
                    var n, e, o, i, r;
                    for (
                      i = [], n = 0, e = (o = this.findAll(t)).length;
                      n < e;
                      n++
                    )
                      (r = o[n]),
                        this.forget(r),
                        this.notify(r, "rejected"),
                        i.push(r);
                    return i;
                  }),
                  (n.prototype.forget = function (t) {
                    var n;
                    return (
                      (this.subscriptions = function () {
                        var e, o, i, r;
                        for (
                          r = [], e = 0, o = (i = this.subscriptions).length;
                          e < o;
                          e++
                        )
                          (n = i[e]) !== t && r.push(n);
                        return r;
                      }.call(this)),
                      t
                    );
                  }),
                  (n.prototype.findAll = function (t) {
                    var n, e, o, i, r;
                    for (
                      i = [], n = 0, e = (o = this.subscriptions).length;
                      n < e;
                      n++
                    )
                      (r = o[n]).identifier === t && i.push(r);
                    return i;
                  }),
                  (n.prototype.reload = function () {
                    var t, n, e, o, i;
                    for (
                      o = [], t = 0, n = (e = this.subscriptions).length;
                      t < n;
                      t++
                    )
                      (i = e[t]), o.push(this.sendCommand(i, "subscribe"));
                    return o;
                  }),
                  (n.prototype.notifyAll = function () {
                    var n, e, o, i, r, c, s;
                    for (
                      e = arguments[0],
                        n = 2 <= arguments.length ? t.call(arguments, 1) : [],
                        c = [],
                        o = 0,
                        i = (r = this.subscriptions).length;
                      o < i;
                      o++
                    )
                      (s = r[o]),
                        c.push(
                          this.notify.apply(this, [s, e].concat(t.call(n)))
                        );
                    return c;
                  }),
                  (n.prototype.notify = function () {
                    var n, e, o, i, r, c, s;
                    for (
                      c = arguments[0],
                        e = arguments[1],
                        n = 3 <= arguments.length ? t.call(arguments, 2) : [],
                        r = [],
                        o = 0,
                        i = (s = "string" == typeof c ? this.findAll(c) : [c])
                          .length;
                      o < i;
                      o++
                    )
                      (c = s[o]),
                        r.push(
                          "function" == typeof c[e] ? c[e].apply(c, n) : void 0
                        );
                    return r;
                  }),
                  (n.prototype.sendCommand = function (t, n) {
                    var e;
                    return (
                      (e = t.identifier),
                      this.consumer.send({ command: n, identifier: e })
                    );
                  }),
                  n
                );
              })();
            }.call(this),
            function () {
              r.Subscription = (function () {
                var t;
                function n(n, e, o) {
                  (this.consumer = n),
                    null == e && (e = {}),
                    (this.identifier = JSON.stringify(e)),
                    t(this, o);
                }
                return (
                  (n.prototype.perform = function (t, n) {
                    return null == n && (n = {}), (n.action = t), this.send(n);
                  }),
                  (n.prototype.send = function (t) {
                    return this.consumer.send({
                      command: "message",
                      identifier: this.identifier,
                      data: JSON.stringify(t),
                    });
                  }),
                  (n.prototype.unsubscribe = function () {
                    return this.consumer.subscriptions.remove(this);
                  }),
                  (t = function (t, n) {
                    var e, o;
                    if (null != n) for (e in n) (o = n[e]), (t[e] = o);
                    return t;
                  }),
                  n
                );
              })();
            }.call(this),
            function () {
              r.Consumer = (function () {
                function t(t) {
                  (this.url = t),
                    (this.subscriptions = new r.Subscriptions(this)),
                    (this.connection = new r.Connection(this));
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
                    if (!this.connection.isActive())
                      return this.connection.open();
                  }),
                  t
                );
              })();
            }.call(this));
        }.call(this),
          t.exports
            ? (t.exports = r)
            : void 0 ===
                (i = "function" == typeof (o = r) ? o.call(n, e, n, t) : o) ||
              (t.exports = i));
      }.call(this));
    },
    function (t, n, e) {
      t.exports = e(2);
    },
    function (t, n, e) {
      "use strict";
      e.r(n);
      var o = e(0),
        i = e.n(o);
      function r(t, n) {
        for (var e = 0; e < n.length; e++) {
          var o = n[e];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            "value" in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function c(t, n, e) {
        return (
          n in t
            ? Object.defineProperty(t, n, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[n] = e),
          t
        );
      }
      var s = (function () {
          function t(n, e) {
            !(function (t, n) {
              if (!(t instanceof n))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              c(this, "_debug", void 0),
              c(this, "_debugLevel", void 0),
              (this._debug = n),
              (this._debugLevel = e);
          }
          var n, e, o;
          return (
            (n = t),
            (e = [
              {
                key: "log",
                value: function (t) {
                  var n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : "error";
                  this._debug &&
                    ("all" == this._debugLevel
                      ? console.log(t)
                      : n == this._debugLevel && console.log(t));
                },
              },
            ]) && r(n.prototype, e),
            o && r(n, o),
            t
          );
        })(),
        l = {
          mounted: function () {
            var t = this;
            this.$options.channels &&
              Object.entries(this.$options.channels).forEach(function (n) {
                "computed" != n[0]
                  ? t.$cable._addChannel(n[0], n[1], t)
                  : n[1].forEach(function (n) {
                      var e = n.channelName(),
                        o = {
                          connected: n.connected,
                          rejected: n.rejected,
                          disconnected: n.rejected,
                          received: n.received,
                        };
                      (t.$options.channels[e] = o),
                        t.$cable._addChannel(e, o, t);
                    });
              });
          },
          destroyed: function () {
            var t = this;
            this.$options.channels &&
              Object.keys(this.$options.channels).forEach(function (n) {
                return t.$cable._removeChannel(n);
              });
          },
        };
      function u(t, n) {
        for (var e = 0; e < n.length; e++) {
          var o = n[e];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            "value" in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function a(t, n, e) {
        return (
          n in t
            ? Object.defineProperty(t, n, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[n] = e),
          t
        );
      }
      var h = (function () {
          function t(n, e) {
            !(function (t, n) {
              if (!(t instanceof n))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              a(this, "_logger", null),
              a(this, "_cable", null),
              a(this, "_channels", { subscriptions: {} }),
              a(this, "_contexts", {}),
              a(this, "_connectionUrl", null),
              a(this, "_jwt", function () {
                return null;
              }),
              (n.prototype.$cable = this),
              n.mixin(l);
            var o = e || {
                debug: !1,
                debugLevel: "error",
                connectionUrl: null,
              },
              i = o.debug,
              r = o.debugLevel,
              c = o.connectionUrl,
              u = o.connectImmediately;
            (this._connectionUrl = c),
              !1 !== u && (u = !0),
              (this._logger = new s(i, r)),
              (this._jwt = e.jwt),
              u && this._connect(this._connectionUrl, this._jwt);
          }
          var n, e, o;
          return (
            (n = t),
            (e = [
              {
                key: "subscribe",
                value: function (t, n) {
                  if (this._cable) {
                    var e = this,
                      o = n || t.channel;
                    this._channels.subscriptions[
                      o
                    ] = this._cable.subscriptions.create(t, {
                      connected: function () {
                        e._fireChannelEvent(o, e._channelConnected);
                      },
                      disconnected: function () {
                        e._fireChannelEvent(o, e._channelDisconnected);
                      },
                      rejected: function () {
                        e._fireChannelEvent(o, e._subscriptionRejected);
                      },
                      received: function (t) {
                        e._fireChannelEvent(o, e._channelReceived, t);
                      },
                    });
                  } else
                    this._connect(this._connectionUrl, this._jwt),
                      this.subscribe(t, n);
                },
              },
              {
                key: "perform",
                value: function (t) {
                  var n = t.channel,
                    e = t.action,
                    o = t.data;
                  this._logger.log(
                    "Performing action '"
                      .concat(e, "' on channel '")
                      .concat(n, "'."),
                    "info"
                  );
                  var i = this._channels.subscriptions[n];
                  if (!i)
                    throw new Error(
                      "You need to be subscribed to perform action '"
                        .concat(e, "' on channel '")
                        .concat(n, "'.")
                    );
                  i.perform(e, o),
                    this._logger.log(
                      "Performed '".concat(e, "' on channel '").concat(n, "'."),
                      "info"
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
                      "info"
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
                        "'."
                      ),
                      "info"
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
                        "'."
                      ),
                      "info"
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
                        "'."
                      )
                    );
                },
              },
              {
                key: "_channelReceived",
                value: function (t, n) {
                  t.received &&
                    t.received.call(this._contexts[t._uid].context, n),
                    this._logger.log(
                      "Message received on channel '".concat(t._name, "'."),
                      "info"
                    );
                },
              },
              {
                key: "_connect",
                value: function (t, n) {
                  if ("string" != typeof t)
                    throw new Error(
                      "Connection URL needs to be a valid Action Cable websocket server URL."
                    );
                  this._cable = n
                    ? i.a.createConsumer(t, n())
                    : i.a.createConsumer(t);
                },
              },
              {
                key: "_addChannel",
                value: function (t, n, e) {
                  (n._uid = e._uid),
                    (n._name = t),
                    (this._channels[t] = n),
                    this._addContext(e);
                },
              },
              {
                key: "_addContext",
                value: function (t) {
                  this._contexts[t._uid]
                    ? ++this._contexts[t._uid].users
                    : (this._contexts[t._uid] = { context: t, users: 1 });
                },
              },
              {
                key: "_removeChannel",
                value: function (t) {
                  if (this._channels.subscriptions[t]) {
                    var n = this._channels[t]._uid;
                    this._channels.subscriptions[t].unsubscribe(),
                      delete this._channels[t],
                      delete this._channels.subscriptions[t],
                      --this._contexts[n].users,
                      this._contexts[n].users <= 0 && delete this._contexts[n],
                      this._logger.log(
                        "Unsubscribed from channel '".concat(t, "'."),
                        "info"
                      );
                  }
                },
              },
              {
                key: "_fireChannelEvent",
                value: function (t, n, e) {
                  if (this._channels.hasOwnProperty(t)) {
                    var o = this._channels[t];
                    n.call(this, o, e);
                  }
                },
              },
            ]) && u(n.prototype, e),
            o && u(n, o),
            t
          );
        })(),
        p = {
          install: function (t, n) {
            new h(t, n);
          },
        };
      n.default = p;
    },
  ]).default;
});
