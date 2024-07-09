import { Component } from '@angular/core';
import { TeamserviceService } from 'src/app/services/team/teamservice.service';

@Component({
  selector: 'app-invit-me',
  templateUrl: './invit-me.component.html',
  styleUrls: ['./invit-me.component.scss'],
})
export class InvitMeComponent {
  user: any;
  dataInvitMe: any[] = [];
  teamAll: any[] = [];
  theadTable: string[] = ['STT', 'Tên team', 'số điện thoại', 'level', 'tuổi'];
  idMyteam: string = '6e415e46-7445-49ce-73fb-08dc9fe1f556';
  constructor(private TeamserviceService: TeamserviceService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getAllTeamByUSer();
    this.getInvitV2();
  }
  getAllTeamByUSer() {
    this.TeamserviceService.getAllTeamByUser().subscribe((team) => {
      console.log(team, 'team 1');
      this.teamAll = team.data.items;
    });
  }
  getInvitV2() {
    this.TeamserviceService.getInvitV3(
      '6e415e46-7445-49ce-73fb-08dc9fe1f556'
    ).subscribe((data: any) => {
      var newData = data.filter((items: any) => {
      return  items.accepted == null && this.idMyteam == items.teamId;
      });
      console.log(newData,'xml:lang')
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
      this.dataInvitMe = newArray;
      console.log('ok', newArray);
    });
  }
}
