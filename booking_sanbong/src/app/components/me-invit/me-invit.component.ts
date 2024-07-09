import { Component, OnInit } from '@angular/core';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-me-invit',
  templateUrl: './me-invit.component.html',
  styleUrls: ['./me-invit.component.scss']
})
export class MeInvitComponent implements OnInit {
  user: any;
  dataInvitMe: any[] = [];
  teamAll: any[] = [];
  theadTable: string[] = ['STT', 'Tên team', 'số điện thoại', 'level', 'tuổi'];
  // đồng ý hoặc từ chối
  idMyteam: string = '6e415e46-7445-49ce-73fb-08dc9fe1f556';
  isCheckRejected: boolean = false;
  constructor(private TeamserviceService: TeamserviceService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getAllTeamByUSer();
    this.getInvitV2();
  }
  ngOnInit(){
    this.getAllTeamByUSer();
  }
  getAllTeamByUSer() {
    this.TeamserviceService.getAllTeamByUser().subscribe((team) => {
      console.log(team, 'team 1212');
      this.teamAll = team.data.items;
    });
  }
  getInvitV2() {
    this.TeamserviceService.getInvitV2(
      '6e415e46-7445-49ce-73fb-08dc9fe1f556'
    ).subscribe((data: any) => {
      var newData = data.filter((items: any) => {
       return items.accepted == 1 && this.idMyteam == items.inviteTeamId;
      });
      const newArray = newData.map((item1: any) => {
        const matchedItem = this.teamAll.find(
          (item2: any) => item2.id == item1.teamId
        );
        console.log(this.teamAll,'newArray')
        return {
          ...item1,
          name: matchedItem ? matchedItem.name : null,
          age : matchedItem ? matchedItem.age : null,
          level: matchedItem ? matchedItem.level : null,
          phone : matchedItem ? matchedItem.phone : null
        };
      });
      this.dataInvitMe = newArray;
      console.log(this.dataInvitMe,'newDatanewDatanewData')
    });
  }
}
