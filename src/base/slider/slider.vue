<template>
  <div class="slider" ref='slider'>
    <div class="slider-group" ref='sliderGroup'>
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'
  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 当视口改变大小时，需要重新计算宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        // 参数true 表示重新计算宽度
        this._setSliderWidth(true)
        // refresh() 是better-scroll 的一个接口
        this.slider.refresh()
      })
    },
    methods: {
      // 计算宽度
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        // 如果要循环轮播时，前后要各复制一张图片才能无缝轮播，所以再加上两张图片的宽度，
        // 在重新计算宽度时，不能再加二倍的图片宽度了
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化 图片下面的小圆点
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      // 初始化slider
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd', () => {
          // 当滑动结束时获取当前索引
          let pageIndex = this.slider.getCurrentPage().pageX
          // 如果循环轮播时索引要减去1，因为前后各复制一张图片
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },

      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          // 因为前面复制了一张图片，所以要加1
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          // 这是better-scroll里的接口，第一个参数表示X轴，第二个参数表示Y轴
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
