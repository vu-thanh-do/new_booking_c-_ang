import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  barChartOptions: any;
  pieChartOptions: any;
  barChartOptions2: any;

  orders: any = [];
  orderAnalitics: any = [];
  usersList : any[] = [];
    constructor(private orderServer: OrderService,private userService: UserService,) {}
  ngOnInit(): void {
    this.orderServer.getAllOrder().subscribe((data) => {
      this.orders = data.data.items.filter(
        (items: any) => items.status == 'Pair'
      );
      console.log(this.orders, 'orders');
      var allOrderTotal = 0;
      for (const newTotal of this.orders) {
        allOrderTotal += Number(newTotal.price);
      }
      this.pieChartOptions = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Doanh thu',
            type: 'pie',
            radius: '50%',
            data: [{ value: allOrderTotal, name: 'Tổng doanh thu' }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    });
    this.orderServer.getAllOrder().subscribe((data) => {
      const filteredOrders = data.data.items.filter((item: any) => item.status === 'Pair');
      const monthlyRevenue = Array(12).fill(0);
      filteredOrders.forEach((order: any) => {
        const createdAt = new Date(order.dateTime);
        const month = createdAt.getMonth();
        monthlyRevenue[month] += order.price;
      });
      this.barChartOptions = {
        title: {
          text: 'Thống kê doanh thu từng tháng',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Doanh thu VND',
            type: 'bar',
            data: monthlyRevenue,
          },
        ],
      };
    });
    this.userService.getUserByAll({
      type: 'EndUser',
    })
    .subscribe((users: any) => {
      console.log(users.data.items, 'users');
       const usersList = users.data.items;

      this.barChartOptions2 = {
        title: {
          text: 'Tổng số người dùng',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: [
            'Tổng số người dùng',
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Số người dùng ',
            type: 'bar',
            data: [usersList.length],
          },
        ],
      };
    });
  }
}
