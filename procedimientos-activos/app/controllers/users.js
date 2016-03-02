import Ember from 'ember';
import UserRepositoryInjected from '../mixins/user-repository-injected';
import MessagerInjected from 'ateam-ember-messager/mixins/messager-injected';

export default Ember.Controller.extend(UserRepositoryInjected, MessagerInjected, {
  actions: {
    create: function() {
      this.promiseWaitingFor(this.repo().createUser())
        .whenSucceeded(Ember.run.bind(this, this.onUserCreated))
        .whenInterruptedAndReauthenticated(Ember.run.bind(this, this.onReauthenticated));
    }
  },
  onUserRemoved: function(removedUser){
    this.userList().removeObject(removedUser);
  },
  // PRIVATE
  userList: function(){
    return this.get('model');
  },
  onUserCreated: function(createdUser){
    this.userList().addObject(createdUser);
    this.navigator().navigateToUsersEdit(createdUser);
  },
  onReauthenticated(){
    this.navigator().navigateToUsers();
  },
  init(){
    this._super();
    this.messager().subscribe({type: 'userRemoved'}, (message)=>{
      this.onUserRemoved(message.removedUser);
    });
  },
  willDestroy(){
    this.messager().unsubscribe({type: 'userRemoved'});
    return this._super();
  }
});
