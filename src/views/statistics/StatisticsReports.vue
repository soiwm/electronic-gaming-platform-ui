<template>
  <PageContainer title="统计报表">
    <div class="statistics-reports">
      <div class="chart-container">
        <div class="chart-card">
          <h3>游戏销量排行榜（前十）</h3>
          <div id="salesChart" class="chart"></div>
        </div>
        <div class="chart-card">
          <h3>用户年龄分布</h3>
          <div id="ageChart" class="chart"></div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script>
import PageContainer from '@/components/common/PageContainer.vue'
import { getSalesRanking, getAgeDistribution } from '@/api/order'
import * as echarts from 'echarts'

export default {
  components: { PageContainer },
  data() {
    return {
      salesChart: null,
      ageChart: null,
      loading: false,
      resizeTimer: null
    }
  },
  mounted() {
    this.initCharts()
    this.fetchStatisticsData()
    
    // 监听窗口大小变化，重新调整图表大小
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)
    // 清除定时器
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer)
    }
    // 销毁图表实例
    if (this.salesChart) {
      this.salesChart.dispose()
    }
    if (this.ageChart) {
      this.ageChart.dispose()
    }
  },
  methods: {
    initCharts() {
      // 初始化销量排行图表
      this.salesChart = echarts.init(document.getElementById('salesChart'))
      
      // 初始化年龄分布图表
      this.ageChart = echarts.init(document.getElementById('ageChart'))
    },
    async fetchStatisticsData() {
      this.loading = true
      try {
        // 并行获取统计数据
        const [salesRes, ageRes] = await Promise.all([
          getSalesRanking(),
          getAgeDistribution()
        ])
        
        // 处理销量排行数据
        if (salesRes && salesRes.code === 200 && salesRes.data) {
          this.renderSalesChart(salesRes.data)
        }
        
        // 处理年龄分布数据
        if (ageRes && ageRes.code === 200 && ageRes.data) {
          this.renderAgeChart(ageRes.data)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        this.$message.error('获取统计数据失败')
      } finally {
        this.loading = false
      }
    },
    renderSalesChart(data) {
      // 确保数据按销量降序排列
      const sortedData = [...data].sort((a, b) => b.sales - a.sales);
      
      const option = {
        title: {
          text: '游戏销量排行',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%', // 增加底部空间，避免游戏名称重叠
          containLabel: true
        },
        xAxis: {
          type: 'category', // 改为分类轴
          data: sortedData.map(item => item.gameName),
          axisLabel: {
            rotate: 45, // 旋转45度，避免标签重叠
            interval: 0 // 显示所有标签
          }
        },
        yAxis: {
          type: 'value', // 改为数值轴
          boundaryGap: [0, 0.01]
        },
        series: [
          {
            name: '销量',
            type: 'bar',
            data: sortedData.map(item => item.sales),
            itemStyle: {
              color: '#1989fa'
            }
          }
        ]
      }
      
      this.salesChart.setOption(option)
    },
    renderAgeChart(data) {
      const option = {
        title: {
          text: '用户年龄分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            radius: '50%',
            data: [
              { value: data.under18 || 0, name: '小于18岁' },
              { value: data.age18to35 || 0, name: '18-35岁' },
              { value: data.age35to50 || 0, name: '35-50岁' },
              { value: data.over50 || 0, name: '大于50岁' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      this.ageChart.setOption(option)
    },
    handleResize() {
      // 使用防抖来避免ResizeObserver循环错误
      if (this.resizeTimer) clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        try {
          if (this.salesChart) {
            this.salesChart.resize()
          }
          if (this.ageChart) {
            this.ageChart.resize()
          }
        } catch (error) {
          // 忽略ResizeObserver循环错误
          if (error.message && error.message.includes('ResizeObserver loop completed')) {
            return
          }
          console.error('图表调整大小错误:', error)
        }
      }, 200)
    }
  }
}
</script>

<style scoped>
.statistics-reports {
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-card {
  flex: 1;
  min-width: 45%;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .chart-card {
    min-width: 100%;
  }
}
</style>