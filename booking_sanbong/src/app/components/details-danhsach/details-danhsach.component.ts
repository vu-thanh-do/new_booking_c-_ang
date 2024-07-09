import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category/category.service';
import { ExcelServiceService } from 'src/app/services/excelService/excel-service.service';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-details-danhsach',
  templateUrl: './details-danhsach.component.html',
  styleUrls: ['./details-danhsach.component.scss'],
})
export class DetailsDanhsachComponent {
  title: string = 'Tất cả Dánh sách mời';
  title2: string = 'Tất cả bạn đã mời';
  checkShowHide: boolean = false;
  routerLink: string = '/admin/add-category';
  theadTable: string[] = ['STT', 'Tên team', 'số điện thoại', 'level', 'tuổi'];
  theadTable2: string[] = [
    'STT',
    'team mời',
    'level',
    'tuổi',
    'SĐT team mời',
    'team được mời',
    'action',
  ];

  team: any[] = [];
  user: any;
  myTeam: any = {};
  acceptValue: any = null;
  nextResult: any = '';
  newResult: any[] = [];
  inviteMe: any[] = [];
  dataInvitMe: any[] = [];
  teamAll : any[] = [];
  check2 = false;
  idMyteam: string = '6e415e46-7445-49ce-73fb-08dc9fe1f556';
  constructor(
    private categoryService: CategoryService,
    private excelServiceService: ExcelServiceService,
    private TeamserviceService: TeamserviceService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getAllTeamByUSer2();
    this.getAllTeamByUSer2();
    this.getAllTeamByUSer2();

    this.getAllTeamByUSer();
    this.getAllTeamByMe();
    this.getInviteByMe();
    this.getInvitV2();

  }
  getAllTeamByUSer2() {
    this.TeamserviceService.getAllTeamByUser().subscribe((team) => {
      console.log(team, 'team 1');
      this.teamAll = team.data.items;
    });
  }
  getAllTeamByUSer() {
    this.acceptValue = this.route.snapshot.queryParamMap.get('accept');
    switch (this.acceptValue) {
      case '1':
        this.nextResult = { all: true, userId: this.user.id };
        break;
      case 'true':
        this.nextResult = { accept: true, userId: this.user.id };
        break;
      case 'false':
        this.nextResult = { accept: false, userId: this.user.id };
        break;
      case '2':
        this.check2 = true;
        break;
      default:
        this.nextResult = { all: true, userId: this.user.id };
    }
    this.TeamserviceService.getDataInviteByUser(this.nextResult).subscribe(
      (team) => {
        console.log(team.data.items.inviteTeam, 'team');
        console.log(team.data.items, 'inv');
        this.team = team.data.items;
        var newData = Object.entries(this.team);
        var nextResult = [];
        for (const [key, value] of newData) {
          console.log(key, '1');
          console.log(value, '2');
          this.checkShowHide =
            value.inviteTeam.userId == this.user.id ? true : false;
          nextResult.push({
            id: value.id,
            nameTeam: value.team.name,
            age: value.team.age,
            level: value.team.level,
            phone: value.team.phone,
            accepted: value.accepted,
          });
        }
        this.newResult = nextResult;

        console.log(this.newResult);
      }
    );
  }
  getAllTeamByMe() {
    this.TeamserviceService.getMyTeam().subscribe((team) => {
      console.log(team, 'team');

      this.myTeam = team.data;
    });
  }
  getInviteByMe() {
    this.TeamserviceService.getInvitWithMe().subscribe((team) => {
      var newResult = [];
      for (const v1 of team.data.items) {
        newResult.push({
          teamId: v1.team.id,
          name: v1.team.name,
          level: v1.team.level,
          age: v1.team.age,
          phone: v1.team.phone,
          myTeamId: v1.inviteTeam.id,
          nameMyTeam: v1.inviteTeam.name,
          levelMyTeam: v1.inviteTeam.level,
          phoneMyTeam: v1.inviteTeam.phone,
          ageMyteam: v1.inviteTeam.age,
        });
      }
      console.log(newResult, 'newResult');
      this.inviteMe = newResult;
    });
  }
  handleDeleteCategory(id: string) {
    if (window.confirm('Are you sure you want to delete'))
      this.TeamserviceService.deleteTeam(id).subscribe(() =>
        this.getAllTeamByUSer()
      );
  }
  inviteCreate(id: string) {
    // const id = this.route.snapshot.paramMap.get('id');
    const data: any = {
      teamId: this.myTeam.id,
      inviteTeamId: id,
      description: '',
    };
    this.TeamserviceService.createInvit(data).subscribe(() => {
      this.toastr.success('Add team successfully');
    });
  }
  actionOnInvite(id: string, action: any) {
    //actionOnInviteAPI
    var dataAcept = {
      id: id,
      accept: action == 1 ? true : false,
    };
    this.TeamserviceService.actionOnInviteAPI(dataAcept).subscribe(() => {
      // window.location.reload();
      this.getAllTeamByUSer();
    });
  }

  getInvitV2() {
    this.TeamserviceService.getInvitV3(
      '6e415e46-7445-49ce-73fb-08dc9fe1f556'
    ).subscribe((data: any) => {
      var newData = data.filter((items: any) => {
      return  items.accepted == null && this.idMyteam == items.teamId;
      });
      console.log(this.teamAll,'xml:lang')
      const newArray = newData.map((item1: any) => {
        const matchedItem = this.teamAll.find(
          (item2: any) => item2.id == item1.inviteTeamId
        );
        return {
          ...item1,
          name: matchedItem ? matchedItem.name : null,
          age : matchedItem ? matchedItem.age : null,
          level: matchedItem ? matchedItem.level : null,
          phone : matchedItem ? matchedItem.phone : null
        };
      });
      this.checkShowHide = true;
      this.dataInvitMe = newArray;
      console.log('ok', newArray);
    });
  }
}
