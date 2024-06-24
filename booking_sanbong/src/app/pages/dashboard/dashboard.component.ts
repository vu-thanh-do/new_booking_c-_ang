import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  barChartOptions: any;
  pieChartOptions: any;

  ngOnInit(): void {
    this.barChartOptions = {
      title: {
        text: 'Số người dùng của web'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Người dùng',
          type: 'bar',
          data: [500, 200, 360, 100, 1000, 2000, 1500, 800, 600, 500, 400, 1000]
        }
      ]
    };

    this.pieChartOptions = {
      title: {
        text: 'Doanh thu'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Doanh thu',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Tháng 1' },
            { value: 735, name: 'Tháng 2' },
            { value: 580, name: 'Tháng 3' },
            { value: 484, name: 'Tháng 4' },
            { value: 300, name: 'Tháng 5' }
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
    };
  }
}
