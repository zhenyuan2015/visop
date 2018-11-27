<template>
  <div class="menu-wrapper">
    <!-- <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path+'?id='+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template> -->
    <template v-for="(item,zindex) in routes" v-if="!item.hidden">
      <router-link v-for="items in item.children" :to="item.path + '/' +items.path+'?id='+items.path" :key="items.name" v-if="!items.meta.showMenu">
        <el-menu-item :index="zindex.toString()" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="items.meta&&items.meta.icon" :icon-class="items.meta.icon"></svg-icon>
          <span v-if="items.meta&&items.meta.title" slot="title">{{generateTitle(items.meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu :index="zindex.toString()" v-else-if="items.meta.showMenu" :key="item.meta.name">
        <template slot="title">
          <svg-icon v-if="items.meta&&items.meta.icon" :icon-class="items.meta.icon"></svg-icon>
          <span>{{items.meta.title}}</span>
        </template>
          <!-- <router-link :to="item.path + '/' +items.path+'?id='+items.path" :key="items.name">
            <el-menu-item :index="zindex.toString()">
              <svg-icon v-if="items.meta&&items.meta.icon" :icon-class="items.meta.icon"></svg-icon>
              <span v-if="items.meta&&items.meta.title" slot="title">{{generateTitle(items.meta.title)}}</span>
            </el-menu-item>
          </router-link> -->
          <router-link v-for="(items1) in items.children" :to="item.path + '/' +items.path + '/' +items1.path+'?id='+items.path" :key="items1.name">
            <el-menu-item :index="zindex.toString()">
              <svg-icon v-if="items1.meta&&items1.meta.icon" :icon-class="items1.meta.icon"></svg-icon>
              <span v-if="items1.meta.title" slot="title">{{items1.meta.title}}</span>
            </el-menu-item>
          </router-link>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    console.log('routes',this.routes)
  },
  methods: {
    hasOneShowingChildren(children) {
      console.log(children,'children')
      const showingChildren = children.filter(item => {
        return item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    generateTitle
  }
}
</script>

