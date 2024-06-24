// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../data.service';

// @Component({
//   selector: 'app-my-echart',
//   templateUrl: './my-echart.component.html',
//   styleUrls: ['./my-echart.component.css']
// })
// export class MyEchartComponent implements OnInit {
//   barChartOptions: any;
//   pieChartOptions: any;

//   constructor(private dataService: DataService) { }

//   ngOnInit(): void {
//     this.dataService.getUserData().subscribe(data => {
//       this.barChartOptions = {
//         title: {
//           text: 'Số người dùng của web'
//         },
//         tooltip: {
//           trigger: 'axis',
//           axisPointer: {
//             type: 'shadow'
//           }
//         },
//         xAxis: {
//           type: 'category',
//           data: data.months // Cập nhật với dữ liệu từ API
//         },
//         yAxis: {
//           type: 'value'
//         },
//         series: [
//           {
//             name: 'Người dùng',
//             type: 'bar',
//             data: data.users // Cập nhật với dữ liệu từ API
//           }
//         ]
//       };
//     });

//     this.dataService.getRevenueData().subscribe(data => {
//       this.pieChartOptions = {
//         title: {
//           text: 'Doanh thu'
//         },
//         tooltip: {
//           trigger: 'item'
//         },
//         legend: {
//           orient: 'vertical',
//           left: 'left'
//         },
//         series: [
//           {
//             name: 'Doanh thu',
//             type: 'pie',
//             radius: '50%',
//             data: data.revenue, // Cập nhật với dữ liệu từ API
//             emphasis: {
//               itemStyle: {
//                 shadowBlur: 10,
//                 shadowOffsetX: 0,
//                 shadowColor: 'rgba(0, 0, 0, 0.5)'
//               }
//             }
//           }
//         ]
//       };
//     });
//   }
// }
