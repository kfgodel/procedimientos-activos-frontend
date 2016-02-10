import Ember from 'ember';
import AuthenticatedRoute from '../../mixins/authenticated-route';
import ProcedureRepositored from '../../mixins/procedure-repositored';
import ServerPromiseHandler from '../../rest/server-promise-handler';
import Authenticatored from '../../mixins/authenticatored';

export default Ember.Route.extend(AuthenticatedRoute, ProcedureRepositored, Authenticatored, {
  queryParams:{
    filterText:{
      refreshModel: true,  // Refresh the model whenever the query param changes
    }
  },
  model: function(params){
    var filterText = params.filterText;
    return this.repo().getAllProceduresMathing(filterText)
      .then(...new ServerPromiseHandler()
        .whenUnauthorized(()=>{
          this.onRequestUnauthorized(filterText);
        })
        .handlers()
      );
  },
  // PRIVATE
  onRequestUnauthorized(filterText){
    this.transitionTo('login');
    this.authenticator().restartAndAfterAuthentication(()=>{
      this.transitionTo('procedures.filter',  {
        queryParams: {filterText: filterText}
      });
    });
  },
});