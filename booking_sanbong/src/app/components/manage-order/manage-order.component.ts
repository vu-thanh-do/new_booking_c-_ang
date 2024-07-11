import { Component } from '@angular/core';
import { IOrder } from 'src/app/interfaces/order.interface';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/user.service';
import { formatCurrency } from 'src/app/utils/format-currency';
import { handleFomatDate } from 'src/app/utils/fomatDate';
import { environment } from 'src/environment';
import axios from 'axios';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent {
  title: string = 'Quản lý đơn hàng';
  apiUrl = environment.API_URL;
  displayedColumns: string[] = [
    'STT',
    'items',
    'inforOrderShipping',
    'status',
    'total',
    'createdAt',
  ];
  dataSourcePending: IOrder[] = [];
  dataSourceDone: IOrder[] = [];
  dataSourceCancel: IOrder[] = [];
  accessToken = JSON.parse(localStorage.getItem('accessToken') || '');
  combinedData: any[] = [];
  theadTable: string[] = ['STT', 'Tên sản phẩm', 'Số lương', 'Trạng thái'];
  orders: any = [];
  orderDones: IOrder[] = [];
  orderCancel: IOrder[] = [];
  orderPending: IOrder[] = [];
  confirmData: IOrder[] = [];
  stakeMoneyData: IOrder[] = [];
  usersList: any = [];
  constructor(
    private userService: UserService,
    private orderServer: OrderService,
    private toastr: ToastrService
  ) {
    this.getAllUsers();
    this.getAllOrders();
  }
  getAllUsers() {
    this.userService.getUserByAll({}).subscribe((users: any) => {
      console.log(users.data.items, 'users');
      this.usersList = users.data.items;
      this.combineData(); // Gọi combineData sau khi có dữ liệu user
    });
  }
  getAllOrders() {
    this.orderServer.getAllOrder().subscribe((order: any) => {
      console.log(order);
      this.orders = order.data.items;
      this.orderCancel = order.data.items.filter(
        (orderA: any) => orderA.status === 'Cancel'
      );
      this.orderDones = order.data.items.filter(
        (orderA: any) => orderA.status === 'Pair'
      );
      this.orderPending = order.data.items.filter(
        (orderA: any) => orderA.status === 'Wait' && orderA.deposited == false
      );
      this.confirmData = order.data.items.filter(
        (orderA: any) =>
          orderA.status === 'Confirm' && orderA.deposited == false
      );
      this.stakeMoneyData = order.data.items.filter(
        (orderA: any) =>
          orderA.deposited == true &&
          orderA.status === 'Confirm' &&
          orderA.status !== 'Cancel' &&
          orderA.status !== 'Pair'
      );
      console.log(this.stakeMoneyData,'stakeMoneyData')
      this.combineData(); // Gọi combineData sau khi có dữ liệu order
    });
  }
  combineData() {
    if (this.orders.length && this.usersList.length) {
      this.combinedData = this.orders.map((order: any) => {
        const user = this.usersList.find((u: any) => u.id === order.userId);
        return {
          ...order,
          user: user ? user : null
        };
      });

      this.orderPending = this.combinedData.filter(
        (order: any) => order.status == 'Wait' && order.deposited == false
      );
      this.orderDones = this.combinedData.filter(
        (order: any) => order.status == 'Pair'
      );
      this.orderCancel = this.combinedData.filter(
        (order: any) => order.status == 'Cancel'
      );
      this.stakeMoneyData = this.combinedData.filter(
        (orderA: any) =>
          orderA.deposited == true &&
          orderA.status === 'Confirm' &&
          orderA.status !== 'Cancel' &&
          orderA.status !== 'Pair'
      );
      console.log(this.dataSourcePending, 'dataSourcePending');
      console.log(this.orderDones, 'dataSourceDone');
      console.log(this.dataSourceCancel, 'dataSourceCancel');
    }
  }

  /* format currentcy */
  formatCurrency(value: number) {
    return formatCurrency(value);
  }

  /* format date */
  formatDate(date: string) {
    return handleFomatDate(date);
  }

  /* handle change status */
  handleChangeStatus(id: string, status: string) {
    this.orderServer.updateOrder(id, status).subscribe((data) => {
      console.log(
        '🚀 ~ ManageOrderComponent ~ this.orderServer.updateOrder ~ data:',
        data
      );
      this.toastr.success('Cập nhật trạng thái đơn hàng thành công');
      this.getAllOrders();
    });
  }

  /* handle confirm order done */
  async handleConfirmOrderDone(id: string) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    const data: any = {
      id: id,
      status: 'Pair',
    };
    this.orderServer.updateStatusOrder(data).subscribe((data: any) => {
      this.orderServer.acceptStakeService(id).subscribe((db: any) => {});
      this.getAllOrders();
      this.toastr.success('updated status');
    });
  }

  /* handle confirm order cancel */
  handleConfirmOrderCancel(id: string) {
    const data = {
      id: id,
      status: 'Cancel',
    };
    this.orderServer.updateStatusOrder(data).subscribe((data: any) => {
      this.getAllOrders();
      this.toastr.success('updated status');
    });
  }

  handlePayment(id: string) {
    const data = {
      id: id,
      status: 'Pair',
    };
    this.orderServer.updateStatusOrder(data).subscribe((data: any) => {
      this.getAllOrders();
      this.toastr.success('updated status');
    });
  }

  handelDetailsBooking(id: string) {
    window.location.href = '';
  }
}
