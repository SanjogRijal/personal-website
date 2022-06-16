
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Core_Components/ImageComponent/Image.svelte generated by Svelte v3.44.0 */

    const file$8 = "src/Core_Components/ImageComponent/Image.svelte";

    // (32:1) {#if type=="fullImage"}
    function create_if_block_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			add_location(img, file$8, 33, 2, 453);
    			attr_dev(div, "class", "img-section fullImage");
    			add_location(div, file$8, 32, 1, 415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(32:1) {#if type==\\\"fullImage\\\"}",
    		ctx
    	});

    	return block;
    }

    // (38:1) {#if type=="roundImage"}
    function create_if_block_1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "class", "svelte-1dhr8fa");
    			add_location(img, file$8, 39, 2, 563);
    			attr_dev(div, "class", "img-section roundImage svelte-1dhr8fa");
    			add_location(div, file$8, 38, 1, 522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(38:1) {#if type==\\\"roundImage\\\"}",
    		ctx
    	});

    	return block;
    }

    // (44:1) {#if type=="coverPhoto"}
    function create_if_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", "coverPhoto svelte-1dhr8fa");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			add_location(img, file$8, 45, 2, 667);
    			attr_dev(div, "class", "img-section");
    			add_location(div, file$8, 44, 1, 637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(44:1) {#if type==\\\"coverPhoto\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let section;
    	let t0;
    	let t1;
    	let if_block0 = /*type*/ ctx[2] == "fullImage" && create_if_block_2(ctx);
    	let if_block1 = /*type*/ ctx[2] == "roundImage" && create_if_block_1(ctx);
    	let if_block2 = /*type*/ ctx[2] == "coverPhoto" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(section, "class", "image-wrapper svelte-1dhr8fa");
    			add_location(section, file$8, 30, 0, 357);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t1);
    			if (if_block2) if_block2.m(section, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*type*/ ctx[2] == "fullImage") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*type*/ ctx[2] == "roundImage") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(section, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*type*/ ctx[2] == "coverPhoto") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(section, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { src } = $$props;
    	let { alt } = $$props;
    	let { type } = $$props;
    	const writable_props = ['src', 'alt', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ src, alt, type });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, alt, type];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { src: 0, alt: 1, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Image> was created without expected prop 'src'");
    		}

    		if (/*alt*/ ctx[1] === undefined && !('alt' in props)) {
    			console.warn("<Image> was created without expected prop 'alt'");
    		}

    		if (/*type*/ ctx[2] === undefined && !('type' in props)) {
    			console.warn("<Image> was created without expected prop 'type'");
    		}
    	}

    	get src() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Core_Components/DetailsComponent/Details.svelte generated by Svelte v3.44.0 */

    const file$7 = "src/Core_Components/DetailsComponent/Details.svelte";

    // (90:2) {#if detailsSubheading}
    function create_if_block(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*detailsSubheading*/ ctx[3]);
    			attr_dev(h3, "class", "subHeading");
    			add_location(h3, file$7, 90, 3, 1373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*detailsSubheading*/ 8) set_data_dev(t, /*detailsSubheading*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(90:2) {#if detailsSubheading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let hr0;
    	let t3;
    	let div1;
    	let p;
    	let t4;
    	let t5;
    	let hr1;
    	let t6;
    	let div2;
    	let h4;
    	let t7;
    	let if_block = /*detailsSubheading*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*detailsHeading*/ ctx[0]);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			hr0 = element("hr");
    			t3 = space();
    			div1 = element("div");
    			p = element("p");
    			t4 = text(/*detailsBody*/ ctx[1]);
    			t5 = space();
    			hr1 = element("hr");
    			t6 = space();
    			div2 = element("div");
    			h4 = element("h4");
    			t7 = text(/*detailsFooter*/ ctx[2]);
    			attr_dev(h1, "class", "detailsHeading svelte-15ymlty");
    			add_location(h1, file$7, 88, 3, 1294);
    			attr_dev(div0, "class", "details-header");
    			add_location(div0, file$7, 87, 2, 1262);
    			add_location(hr0, file$7, 93, 2, 1442);
    			attr_dev(p, "class", "detailsBody svelte-15ymlty");
    			add_location(p, file$7, 95, 3, 1480);
    			attr_dev(div1, "class", "details-body svelte-15ymlty");
    			add_location(div1, file$7, 94, 2, 1450);
    			add_location(hr1, file$7, 97, 2, 1532);
    			attr_dev(h4, "class", "detailsFooter svelte-15ymlty");
    			add_location(h4, file$7, 99, 3, 1572);
    			attr_dev(div2, "class", "details-footer");
    			add_location(div2, file$7, 98, 2, 1540);
    			attr_dev(div3, "class", "details-section details-wrapper svelte-15ymlty");
    			add_location(div3, file$7, 86, 1, 1214);
    			attr_dev(section, "class", "svelte-15ymlty");
    			add_location(section, file$7, 85, 0, 1203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div3, t2);
    			append_dev(div3, hr0);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(p, t4);
    			append_dev(div3, t5);
    			append_dev(div3, hr1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, h4);
    			append_dev(h4, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*detailsHeading*/ 1) set_data_dev(t0, /*detailsHeading*/ ctx[0]);

    			if (/*detailsSubheading*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*detailsBody*/ 2) set_data_dev(t4, /*detailsBody*/ ctx[1]);
    			if (dirty & /*detailsFooter*/ 4) set_data_dev(t7, /*detailsFooter*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Details', slots, []);
    	let { detailsHeading } = $$props;
    	let { detailsBody } = $$props;
    	let { detailsFooter } = $$props;
    	let { detailsSubheading } = $$props;
    	const writable_props = ['detailsHeading', 'detailsBody', 'detailsFooter', 'detailsSubheading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Details> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('detailsHeading' in $$props) $$invalidate(0, detailsHeading = $$props.detailsHeading);
    		if ('detailsBody' in $$props) $$invalidate(1, detailsBody = $$props.detailsBody);
    		if ('detailsFooter' in $$props) $$invalidate(2, detailsFooter = $$props.detailsFooter);
    		if ('detailsSubheading' in $$props) $$invalidate(3, detailsSubheading = $$props.detailsSubheading);
    	};

    	$$self.$capture_state = () => ({
    		detailsHeading,
    		detailsBody,
    		detailsFooter,
    		detailsSubheading
    	});

    	$$self.$inject_state = $$props => {
    		if ('detailsHeading' in $$props) $$invalidate(0, detailsHeading = $$props.detailsHeading);
    		if ('detailsBody' in $$props) $$invalidate(1, detailsBody = $$props.detailsBody);
    		if ('detailsFooter' in $$props) $$invalidate(2, detailsFooter = $$props.detailsFooter);
    		if ('detailsSubheading' in $$props) $$invalidate(3, detailsSubheading = $$props.detailsSubheading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [detailsHeading, detailsBody, detailsFooter, detailsSubheading];
    }

    class Details extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			detailsHeading: 0,
    			detailsBody: 1,
    			detailsFooter: 2,
    			detailsSubheading: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Details",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*detailsHeading*/ ctx[0] === undefined && !('detailsHeading' in props)) {
    			console.warn("<Details> was created without expected prop 'detailsHeading'");
    		}

    		if (/*detailsBody*/ ctx[1] === undefined && !('detailsBody' in props)) {
    			console.warn("<Details> was created without expected prop 'detailsBody'");
    		}

    		if (/*detailsFooter*/ ctx[2] === undefined && !('detailsFooter' in props)) {
    			console.warn("<Details> was created without expected prop 'detailsFooter'");
    		}

    		if (/*detailsSubheading*/ ctx[3] === undefined && !('detailsSubheading' in props)) {
    			console.warn("<Details> was created without expected prop 'detailsSubheading'");
    		}
    	}

    	get detailsHeading() {
    		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detailsHeading(value) {
    		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get detailsBody() {
    		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detailsBody(value) {
    		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get detailsFooter() {
    		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detailsFooter(value) {
    		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get detailsSubheading() {
    		throw new Error("<Details>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detailsSubheading(value) {
    		throw new Error("<Details>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PagesComponent/About/About.svelte generated by Svelte v3.44.0 */
    const file$6 = "src/PagesComponent/About/About.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let img;
    	let t;
    	let details;
    	let current;

    	img = new Image({
    			props: {
    				src: "/images/about_image.jpg",
    				alt: "aboutImage",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details = new Details({
    			props: {
    				detailsHeading: "About Me",
    				detailsBody: "Namaskar! Welcome to my website. I am Sanjog Rijal.\n\t\tI am a Software Engineer and IT Professional with more than 5 years of industry experience. I have Masters Degree in Computer Application and am currently engaged as Senior Software Engineer. My Key Skills are: Problem Solving, Programming in various languages, Web Development (MEAN/MERN), SDLC, Project Management and Cyber Security",
    				detailsFooter: "SANJOG RIJAL"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(img.$$.fragment);
    			t = space();
    			create_component(details.$$.fragment);
    			attr_dev(div, "class", "about-wrapper");
    			add_location(div, file$6, 12, 0, 254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(img, div, null);
    			append_dev(div, t);
    			mount_component(details, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img.$$.fragment, local);
    			transition_in(details.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img.$$.fragment, local);
    			transition_out(details.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(img);
    			destroy_component(details);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let aboutMe = "ABOUT ME";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Img: Image, Details, aboutMe });

    	$$self.$inject_state = $$props => {
    		if ('aboutMe' in $$props) aboutMe = $$props.aboutMe;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/PagesComponent/Navbar/navbar.svelte generated by Svelte v3.44.0 */

    const { console: console_1$1 } = globals;
    const file$5 = "src/PagesComponent/Navbar/navbar.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			a0 = element("a");
    			a0.textContent = "About";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Education";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Experiences";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "Projects";
    			attr_dev(a0, "class", "bounce svelte-ygih3z");
    			add_location(a0, file$5, 30, 1, 451);
    			attr_dev(a1, "class", "bounce svelte-ygih3z");
    			add_location(a1, file$5, 31, 1, 506);
    			attr_dev(a2, "class", "bounce svelte-ygih3z");
    			add_location(a2, file$5, 32, 1, 565);
    			attr_dev(a3, "class", "bounce svelte-ygih3z");
    			add_location(a3, file$5, 33, 1, 626);
    			attr_dev(section, "class", "nav-bar svelte-ygih3z");
    			add_location(section, file$5, 29, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, a0);
    			append_dev(section, t1);
    			append_dev(section, a1);
    			append_dev(section, t3);
    			append_dev(section, a2);
    			append_dev(section, t5);
    			append_dev(section, a3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*handleScroll*/ ctx[0], false, false, false),
    					listen_dev(a1, "click", /*handleScroll*/ ctx[0], false, false, false),
    					listen_dev(a2, "click", /*handleScroll*/ ctx[0], false, false, false),
    					listen_dev(a3, "click", /*handleScroll*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const education = "svelte-101h99i";
    const about = "svelte";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);

    	const log = msg => {
    		console.log("msg: " + msg);
    	};

    	const handleScroll = clickedMenu => {
    		let anchorElement = clickedMenu.target.innerHTML;

    		switch (anchorElement) {
    			case "About":
    				window.scrollTo(0, 110);
    				break;
    			case "Education":
    				window.scrollTo(0, 862);
    				log(window.scrollY);
    				break;
    			case "Experiences":
    				window.scrollTo(0, 2195);
    				break;
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ education, about, log, handleScroll });
    	return [handleScroll];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Core_Components/ContainerComponent/Containers.svelte generated by Svelte v3.44.0 */

    const file$4 = "src/Core_Components/ContainerComponent/Containers.svelte";

    function create_fragment$4(ctx) {
    	let section;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "container svelte-148ggyb");
    			add_location(div, file$4, 20, 1, 232);
    			attr_dev(section, "class", "container-section");
    			add_location(section, file$4, 18, 0, 193);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Containers', slots, ['default']);
    	let { content } = $$props;
    	const writable_props = ['content'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Containers> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ content });

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, $$scope, slots];
    }

    class Containers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { content: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Containers",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[0] === undefined && !('content' in props)) {
    			console.warn("<Containers> was created without expected prop 'content'");
    		}
    	}

    	get content() {
    		throw new Error("<Containers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Containers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PagesComponent/EducationDetails/EducationDetails.svelte generated by Svelte v3.44.0 */
    const file$3 = "src/PagesComponent/EducationDetails/EducationDetails.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let div1;
    	let div0;
    	let img0;
    	let t0;
    	let details0;
    	let t1;
    	let div3;
    	let div2;
    	let img1;
    	let t2;
    	let details1;
    	let t3;
    	let div5;
    	let div4;
    	let img2;
    	let t4;
    	let details2;
    	let current;

    	img0 = new Image({
    			props: {
    				src: "/images/education_details_image_mca.jpg",
    				alt: "Masters Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details0 = new Details({
    			props: {
    				detailsHeading: "PGDCA | MCA",
    				detailsSubheading: "PGDCA/MCA (2018-2021)",
    				detailsBody: "Software Engineering | Computer Organization | Design and Analysis of Algorithms and Structure | Advanced Java | Web Technologies | Advance Operating Systems | Advanced DBMS | Artificial Intelligence",
    				detailsFooter: "Masters Level"
    			},
    			$$inline: true
    		});

    	img1 = new Image({
    			props: {
    				src: "/images/education_details_image_bachelors.png",
    				alt: "Masters Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details1 = new Details({
    			props: {
    				detailsHeading: "Bachelors of Computer Information Systems",
    				detailsSubheading: "BCIS (2013-2017)",
    				detailsBody: "Problem Solving | Java | Advanced Java | Computer Architecture & Organization | Data Structure  Web Technologies | Networking and Operating Systems | Project Management",
    				detailsFooter: "Bachelors Level"
    			},
    			$$inline: true
    		});

    	img2 = new Image({
    			props: {
    				src: "/images/education_details_image_bnks.jpeg",
    				alt: "BNKS Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details2 = new Details({
    			props: {
    				detailsHeading: "A-levels/SLC",
    				detailsSubheading: "SLC/A-levels(2010-2012)",
    				detailsBody: "Economics | Business | Sociology | Pure Maths | General Paper",
    				detailsFooter: "Secondary/Higher Secondary Level"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(img0.$$.fragment);
    			t0 = space();
    			create_component(details0.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(img1.$$.fragment);
    			t2 = space();
    			create_component(details1.$$.fragment);
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			create_component(img2.$$.fragment);
    			t4 = space();
    			create_component(details2.$$.fragment);
    			attr_dev(div0, "class", "education-detail-masters svelte-1ak4zxv");
    			add_location(div0, file$3, 32, 1, 480);
    			attr_dev(div1, "class", "education-details-wrapper");
    			add_location(div1, file$3, 31, 0, 437);
    			attr_dev(div2, "class", "education-detail-bachelors svelte-1ak4zxv");
    			add_location(div2, file$3, 43, 1, 1016);
    			attr_dev(div3, "class", "education-details-wrapper");
    			add_location(div3, file$3, 42, 0, 973);
    			attr_dev(div4, "class", "education-detail-bnks svelte-1ak4zxv");
    			add_location(div4, file$3, 52, 1, 1557);
    			attr_dev(div5, "class", "education-details-wrapper");
    			add_location(div5, file$3, 51, 1, 1514);
    			add_location(section, file$3, 27, 0, 423);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			mount_component(img0, div0, null);
    			append_dev(div0, t0);
    			mount_component(details0, div0, null);
    			append_dev(section, t1);
    			append_dev(section, div3);
    			append_dev(div3, div2);
    			mount_component(img1, div2, null);
    			append_dev(div2, t2);
    			mount_component(details1, div2, null);
    			append_dev(section, t3);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			mount_component(img2, div4, null);
    			append_dev(div4, t4);
    			mount_component(details2, div4, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img0.$$.fragment, local);
    			transition_in(details0.$$.fragment, local);
    			transition_in(img1.$$.fragment, local);
    			transition_in(details1.$$.fragment, local);
    			transition_in(img2.$$.fragment, local);
    			transition_in(details2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img0.$$.fragment, local);
    			transition_out(details0.$$.fragment, local);
    			transition_out(img1.$$.fragment, local);
    			transition_out(details1.$$.fragment, local);
    			transition_out(img2.$$.fragment, local);
    			transition_out(details2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(img0);
    			destroy_component(details0);
    			destroy_component(img1);
    			destroy_component(details1);
    			destroy_component(img2);
    			destroy_component(details2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EducationDetails', slots, []);
    	let educationDetails = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EducationDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Img: Image, Details, educationDetails });

    	$$self.$inject_state = $$props => {
    		if ('educationDetails' in $$props) educationDetails = $$props.educationDetails;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class EducationDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EducationDetails",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/PagesComponent/ExperiencesDetails/ExperienceDetails.svelte generated by Svelte v3.44.0 */
    const file$2 = "src/PagesComponent/ExperiencesDetails/ExperienceDetails.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let div1;
    	let div0;
    	let img0;
    	let t0;
    	let details0;
    	let t1;
    	let div3;
    	let div2;
    	let img1;
    	let t2;
    	let details1;
    	let t3;
    	let div5;
    	let div4;
    	let img2;
    	let t4;
    	let details2;
    	let t5;
    	let div7;
    	let div6;
    	let img3;
    	let t6;
    	let details3;
    	let t7;
    	let div9;
    	let div8;
    	let img4;
    	let t8;
    	let details4;
    	let current;

    	img0 = new Image({
    			props: {
    				src: "/images/experience_details_terakoya.png",
    				alt: "Terakoya Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details0 = new Details({
    			props: {
    				detailsHeading: "Terakoya Academia",
    				detailsSubheading: "Sr. Software Engineer",
    				detailsBody: "Sr. Software Engineer | Team Lead | Software Architecture and Design | Project Management | Elasticsearch | Python | Angular",
    				detailsFooter: "January 2022 - Present"
    			},
    			$$inline: true
    		});

    	img1 = new Image({
    			props: {
    				src: "/images/experience_details_image_vairav.png",
    				alt: "Vairav Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details1 = new Details({
    			props: {
    				detailsHeading: "Vairav Technology",
    				detailsSubheading: "Software Engineer",
    				detailsBody: "Elasticsearch | Logstash | Kibana | ReactJS | Hapi | NodeJS",
    				detailsFooter: "January 2020 - January 2022"
    			},
    			$$inline: true
    		});

    	img2 = new Image({
    			props: {
    				src: "/images/experience_details_image_sasoft.png",
    				alt: "Sasoft Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details2 = new Details({
    			props: {
    				detailsHeading: "SASOFT PVT LTD.",
    				detailsSubheading: "Freelance Project Manager",
    				detailsBody: "Office Setup | Office Management | Angular Development",
    				detailsFooter: "2018-2019"
    			},
    			$$inline: true
    		});

    	img3 = new Image({
    			props: {
    				src: "/images/experience_details_image_krennova.png",
    				alt: "Krennova Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details3 = new Details({
    			props: {
    				detailsHeading: "Software Engineer at Krennova",
    				detailsSubheading: "Software Engineer",
    				detailsBody: "MEAN Stack Software Engineer | Income/Expense Application | Management Information System | Video Streaming Platform - Prime time visualization | Print Sewa- Printing eCommerce Site",
    				detailsFooter: "2017-2018"
    			},
    			$$inline: true
    		});

    	img4 = new Image({
    			props: {
    				src: "/images/experience_details_image_leapfrog.jpeg",
    				alt: "Leapfrog Image",
    				type: "coverPhoto"
    			},
    			$$inline: true
    		});

    	details4 = new Details({
    			props: {
    				detailsHeading: "Leapfrog Technology",
    				detailsBody: "End To End Process | Software Development Lifecycle | Agile | Project Management | Quality Assurance",
    				detailsFooter: "October 2019 - November 2019"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(img0.$$.fragment);
    			t0 = space();
    			create_component(details0.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(img1.$$.fragment);
    			t2 = space();
    			create_component(details1.$$.fragment);
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			create_component(img2.$$.fragment);
    			t4 = space();
    			create_component(details2.$$.fragment);
    			t5 = space();
    			div7 = element("div");
    			div6 = element("div");
    			create_component(img3.$$.fragment);
    			t6 = space();
    			create_component(details3.$$.fragment);
    			t7 = space();
    			div9 = element("div");
    			div8 = element("div");
    			create_component(img4.$$.fragment);
    			t8 = space();
    			create_component(details4.$$.fragment);
    			attr_dev(div0, "class", "experience-detail-terakoya svelte-1fv1o3t");
    			add_location(div0, file$2, 39, 1, 628);
    			attr_dev(div1, "class", "experience-details-wrapper");
    			add_location(div1, file$2, 38, 1, 584);
    			attr_dev(div2, "class", "experience-detail-vairav svelte-1fv1o3t");
    			add_location(div2, file$2, 48, 1, 1108);
    			attr_dev(div3, "class", "experience-details-wrapper");
    			add_location(div3, file$2, 47, 1, 1064);
    			attr_dev(div4, "class", "experience-detail-sasoft svelte-1fv1o3t");
    			add_location(div4, file$2, 58, 1, 1526);
    			attr_dev(div5, "class", "experience-details-wrapper");
    			add_location(div5, file$2, 57, 0, 1482);
    			attr_dev(div6, "class", "experience-detail-krennova svelte-1fv1o3t");
    			add_location(div6, file$2, 67, 1, 1925);
    			attr_dev(div7, "class", "experience-details-wrapper");
    			add_location(div7, file$2, 66, 0, 1881);
    			attr_dev(div8, "class", "experience-detail-leapfrog svelte-1fv1o3t");
    			add_location(div8, file$2, 77, 1, 2463);
    			attr_dev(div9, "class", "experience-details-wrapper");
    			add_location(div9, file$2, 76, 1, 2419);
    			add_location(section, file$2, 36, 0, 572);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			mount_component(img0, div0, null);
    			append_dev(div0, t0);
    			mount_component(details0, div0, null);
    			append_dev(section, t1);
    			append_dev(section, div3);
    			append_dev(div3, div2);
    			mount_component(img1, div2, null);
    			append_dev(div2, t2);
    			mount_component(details1, div2, null);
    			append_dev(section, t3);
    			append_dev(section, div5);
    			append_dev(div5, div4);
    			mount_component(img2, div4, null);
    			append_dev(div4, t4);
    			mount_component(details2, div4, null);
    			append_dev(section, t5);
    			append_dev(section, div7);
    			append_dev(div7, div6);
    			mount_component(img3, div6, null);
    			append_dev(div6, t6);
    			mount_component(details3, div6, null);
    			append_dev(section, t7);
    			append_dev(section, div9);
    			append_dev(div9, div8);
    			mount_component(img4, div8, null);
    			append_dev(div8, t8);
    			mount_component(details4, div8, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img0.$$.fragment, local);
    			transition_in(details0.$$.fragment, local);
    			transition_in(img1.$$.fragment, local);
    			transition_in(details1.$$.fragment, local);
    			transition_in(img2.$$.fragment, local);
    			transition_in(details2.$$.fragment, local);
    			transition_in(img3.$$.fragment, local);
    			transition_in(details3.$$.fragment, local);
    			transition_in(img4.$$.fragment, local);
    			transition_in(details4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img0.$$.fragment, local);
    			transition_out(details0.$$.fragment, local);
    			transition_out(img1.$$.fragment, local);
    			transition_out(details1.$$.fragment, local);
    			transition_out(img2.$$.fragment, local);
    			transition_out(details2.$$.fragment, local);
    			transition_out(img3.$$.fragment, local);
    			transition_out(details3.$$.fragment, local);
    			transition_out(img4.$$.fragment, local);
    			transition_out(details4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(img0);
    			destroy_component(details0);
    			destroy_component(img1);
    			destroy_component(details1);
    			destroy_component(img2);
    			destroy_component(details2);
    			destroy_component(img3);
    			destroy_component(details3);
    			destroy_component(img4);
    			destroy_component(details4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperienceDetails', slots, []);
    	let experienceDetails = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperienceDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Img: Image, Details, experienceDetails });

    	$$self.$inject_state = $$props => {
    		if ('experienceDetails' in $$props) experienceDetails = $$props.experienceDetails;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class ExperienceDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperienceDetails",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Core_Components/BackToTop/BackToTop.svelte generated by Svelte v3.44.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/Core_Components/BackToTop/BackToTop.svelte";

    function create_fragment$1(ctx) {
    	let a;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span = element("span");
    			attr_dev(span, "class", "svelte-1xymsja");
    			add_location(span, file$1, 32, 66, 695);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "id", "scroll");
    			attr_dev(a, "class", "svelte-1xymsja");
    			add_location(a, file$1, 32, 0, 629);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span);
    			/*a_binding*/ ctx[2](a);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*scroller*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			/*a_binding*/ ctx[2](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BackToTop', slots, []);
    	let backToTop;
    	let topNotch;

    	onMount(() => {
    		console.log(window.scrollY);
    		topNotch = backToTop;

    		if (window.scrollY > 150) {
    			console.log(backToTop);
    			$$invalidate(0, backToTop.style.display = 'block', backToTop);
    			console.log("DOM", document.getElementById('backToTop'));
    		} else {
    			console.log(backToTop);
    		}
    	});

    	console.log(topNotch);

    	let scroller = target => {
    		document.getElementsByTagName("html")[0].scrollBy(0, 0);
    		document.getElementsByTagName("body")[0].scrollBy(0, 0);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<BackToTop> was created with unknown prop '${key}'`);
    	});

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			backToTop = $$value;
    			$$invalidate(0, backToTop);
    		});
    	}

    	$$self.$capture_state = () => ({ onMount, backToTop, topNotch, scroller });

    	$$self.$inject_state = $$props => {
    		if ('backToTop' in $$props) $$invalidate(0, backToTop = $$props.backToTop);
    		if ('topNotch' in $$props) topNotch = $$props.topNotch;
    		if ('scroller' in $$props) $$invalidate(1, scroller = $$props.scroller);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [backToTop, scroller, a_binding];
    }

    class BackToTop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackToTop",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.0 */
    const file = "src/App.svelte";

    // (21:1) <Container>
    function create_default_slot_2(ctx) {
    	let div;
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(about.$$.fragment);
    			attr_dev(div, "class", "about");
    			add_location(div, file, 21, 2, 546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(about, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(about);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(21:1) <Container>",
    		ctx
    	});

    	return block;
    }

    // (27:1) <Container>
    function create_default_slot_1(ctx) {
    	let div;
    	let educationdetails;
    	let current;
    	educationdetails = new EducationDetails({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(educationdetails.$$.fragment);
    			attr_dev(div, "class", "education-details");
    			add_location(div, file, 27, 2, 618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(educationdetails, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(educationdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(educationdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(educationdetails);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(27:1) <Container>",
    		ctx
    	});

    	return block;
    }

    // (33:1) <Container>
    function create_default_slot(ctx) {
    	let div;
    	let experiencedetails;
    	let current;
    	experiencedetails = new ExperienceDetails({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(experiencedetails.$$.fragment);
    			attr_dev(div, "class", "experience-details");
    			add_location(div, file, 33, 2, 712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(experiencedetails, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experiencedetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experiencedetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(experiencedetails);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(33:1) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let navbar;
    	let t0;
    	let container0;
    	let t1;
    	let container1;
    	let t2;
    	let container2;
    	let t3;
    	let backtotop;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	container0 = new Containers({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Containers({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container2 = new Containers({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	backtotop = new BackToTop({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(container0.$$.fragment);
    			t1 = space();
    			create_component(container1.$$.fragment);
    			t2 = space();
    			create_component(container2.$$.fragment);
    			t3 = space();
    			create_component(backtotop.$$.fragment);
    			attr_dev(div, "class", "nav-bar svelte-1vz6864");
    			add_location(div, file, 16, 1, 486);
    			attr_dev(main, "class", "svelte-1vz6864");
    			add_location(main, file, 14, 0, 477);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(navbar, div, null);
    			append_dev(main, t0);
    			mount_component(container0, main, null);
    			append_dev(main, t1);
    			mount_component(container1, main, null);
    			append_dev(main, t2);
    			mount_component(container2, main, null);
    			append_dev(main, t3);
    			mount_component(backtotop, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    			const container2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);
    			transition_in(backtotop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			transition_out(backtotop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(container2);
    			destroy_component(backtotop);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		About,
    		Navbar,
    		Container: Containers,
    		EducationDetails,
    		ExperienceDetails,
    		BackToTop
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
