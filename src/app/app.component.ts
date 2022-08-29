import { Component, Input } from '@angular/core';
import { MOCK_USERS, user } from './mock_users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-lists';
  users: user[] = MOCK_USERS;
  selectedUsers: user[] = [];
  buttonValues: String[] = [">", ">>", "<<", "<"]
  clicked: user | undefined = undefined;
  @Input() newUserField?: string;

  click(u: user): void {
    if(this.clicked === undefined) {
      this.clicked = u;
      u.clicked = true;
    }
    else if (this.clicked !== u) {
      this.clicked.clicked = false;
      this.clicked = u;
      u.clicked = true;
    }
    else if (this.clicked === u) {
      this.clicked = undefined;
      u.clicked = false;
    }
  }

  refreshSelected(): void {
    this.users.forEach(u => {
      if(u.selected && !this.selectedUsers.includes(u)) {
          this.selectedUsers.push(u)
      }
    })
    this.selectedUsers = this.selectedUsers.filter(u => u.selected)
  }

  selectAll(): void {
    this.users.forEach(u => u.selected = true)
    this.refreshSelected()
  }

  unselectAll(): void {
    this.users.forEach(u => u.selected = false)
    this.refreshSelected()
  }

  select(): void {
    if(this.clicked !== undefined) {
      this.users.find(u => u.id === this.clicked!.id)!.selected = true;
      this.refreshSelected()
    }
  }

  unselect(): void {
    if(this.clicked !== undefined) {
      this.users.find(u => u.id === this.clicked!.id)!.selected = false;
      this.refreshSelected()
    }
  }

  addUser(): void {
    if(this.newUserField !== undefined) {
      let newID = Math.max(...this.users.map(u => u.id))+1;
      this.users.push({id:newID, name:this.newUserField, clicked:false, selected:false})
      this.newUserField='';
    }
  }
}