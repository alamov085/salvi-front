<template>
  <div
    v-show="node.visible"
    class="el-tree-node"
    :class="{
      'is-expanded': expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    @click.stop="handleClick(node)"
    @contextmenu="$event => this.handleContextMenu($event)"
  >
    <div
      class="el-tree-node__content hello1"
      :class="{ 'is-active': expanded }"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }"
    >
      <span
        v-if="!node.store.horizontal"
        class="el-tree-node__expand-icon el-icon-caret-right"
        :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }"
        @click.stop="handleExpandIconClick"
      ></span>
      <template v-if="showCheckbox">
        <el-checkbox
          v-if="tree.$props.openWhenCheck"
          v-model="node.checked"
          :label="node.label"
          :title="node.label"
          :indeterminate="node.indeterminate"
          :disabled="!!node.disabled"
          @change="handleCheckChange"
        />
        <el-checkbox
          v-else
          v-model="node.checked"
          :label="node.label"
          :title="node.label"
          :indeterminate="node.indeterminate"
          :disabled="!!node.disabled"
          @click.native.stop
          @change="handleCheckChange"
        />
      </template>
      <span class="badge">{{ this.node.data.total_product }}</span>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      ></span>
      <node-content :node="node" />
      <!--<span-->
      <!--v-if="tree.$props.horizontal"-->
      <!--class="el-tree-node__expand-icon el-icon-caret-right right-icon"-->
      <!--:class="{ 'is-leaf': node.isLeaf }"/>-->
      <v-icon
        v-if="tree.$props.horizontal"
        class="el-tree-node__expand-icon right-icon"
        :class="{ 'is-leaf': node.isLeaf }"
      >keyboard_arrow_right</v-icon>
    </div>
    <el-collapse-transition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="!tree.$props.horizontal && expanded"
        class="el-tree-node__children hello2"
        role="group"
        :aria-expanded="expanded"
      >
        <el-tree-node
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :node="child"
          @filterUUID="filterUUID"
          @node-expand="handleChildNodeExpand"
        />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition'
import ElCheckbox from 'element-ui/packages/checkbox'
import emitter from 'element-ui/src/mixins/emitter'
import { getNodeKey } from './model/util'

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  components: {
    ElCollapseTransition,
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : tree.$scopedSlots.default
              ? tree.$scopedSlots.default({ node, data })
              : <span class="el-tree-node__label" style="display: none">{ this.node.label }</span>
        )
      }
    }
  },

  mixins: [emitter],

  props: {
    clear: Boolean,
    node: {
      type: Object,
      default() {
        return {}
      }
    },
    props: {
      type: Object,
      default() {
        return {}
      }
    },
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null,
      disableClear: true
    }
  },

  watch: {
    'node.indeterminate': function(val) {
      this.handleSelectChange(this.node.checked, val)
    },

    'node.checked': function(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },

    'node.expanded': function(val) {
      this.$nextTick(() => (this.expanded = val))
      if (val) {
        this.childNodeRendered = true
      }
    },
    clear(e){
      if(e){
        this.uncheckAll()
      }
    }
  },

  created() {
    const parent = this.$parent

    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }
    const tree = this.tree
    if (!tree) {
      console.warn('Can not find node\'s tree.')
    }

    const props = tree.props || {}
    const childrenKey = props.children || 'children'

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren()
    })

    this.showCheckbox = tree.showCheckbox

    if (this.node.expanded) {
      this.expanded = true
      this.childNodeRendered = true
    }

    if (this.tree.accordion) {
      this.$on('tree-node-expand', node => {
        if (this.node !== node) {
          this.node.collapse()
        }
      })
    }
  },

  methods: {
      filterUUID(e) {
          this.$emit('filterUUID', e)
      },
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data)
    },

    handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.indeterminate = indeterminate
    },
    childExpanded(e, expanded){
      if(e.childNodes.length > 0 && !expanded){
          let x = []
          e.childNodes.forEach(function (child) {
              let a
              a = child
              a.expanded = expanded
              x.push(a)
          })
          e.childNodes = x
          return e
      }else {
          return e
      }
    },
    handleClick(e) {
       e = this.childExpanded(e, e.expanded)
      let parentChild = []
      e.parent.childNodes.forEach(function (x) {
          let a
         if(e.id == x.id){
             a = x
             x.expanded = e.expanded
         }else {
             a = x
             x.expanded = false
         }
          parentChild.push(a)
      })
        e.parent.childNodes = parentChild
        this.node = e
      const store = this.tree.store
      store.setCurrentNode(this.node)
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode)
      this.tree.currentNode = this
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick()
      }
      this.tree.$emit('node-click', this.node.data, this.node, this)
    },

    handleContextMenu(event) {
      this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this)
    },

    handleExpandIconClick() {

      const store = this.tree.store
      if (this.node.isLeaf) return
      if (this.expanded) {
        store.levelShow.splice(this.node.level - 1, store.levelShow.length)
        this.tree.$emit('node-collapse', this.node.data, this.node, this)
        this.node.collapse()
      } else {
        store.levelShow.splice(this.node.level - 1, store.levelShow.length, this.node)
        this.node.expand()
        this.$emit('node-expand', this.node.data, this.node, this)
      }
    },
    uncheckAll(){
      this.tree.store.setCheckedNodes([])
      if(this.disableClear){

          this.$emit('filterUUID',{
              uuid: ''
          })
      }
        this.disableClear = true

    },
    handleCheckChange(value, ev) {
      this.disableClear = false

      this.uncheckAll()
      this.$nextTick(function () {

          this.node.setChecked(ev.target.checked, !this.tree.checkStrictly)
          if(value == true){
              this.$emit('filterUUID', this.node.data)
          }else {
              this.$emit('filterUUID',{
                  uuid: ''
              })
          }
      })


      this.$nextTick(() => {
        const store = this.tree.store
        this.tree.$emit('check', this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys(),
        })


      })
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node)
      this.tree.$emit('node-expand', nodeData, node, instance)
    }
  }
}
</script>
