var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://person.clearbit.com/'
});

var pickInputs = {
        'id': { key: 'id', validate: { req: true }},
        'given_name': 'given_name',
        'family_name': 'family_name',
        'employment_title': 'employment_title',
        'facebook_handle': 'facebook_handle',
        'linkedin_handle': 'linkedin_handle',
        'twitter_handle': 'twitter_handle',
        'github_handle': 'github_handle'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            apiKey = dexter.environment('clearbit_api_key');

        if (!apiKey)
            return this.fail('A [clearbit_api_key] environment variable is required for this module');

        if (validateErrors)
            return this.fail(validateErrors);

        request.post({
            uri: '/v1/people/' + inputs.id + '/flag',
            qs: inputs,
            auth: { user: apiKey, pass: '' },
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.error)
                this.fail(body.error);
            else
                this.complete({ success: true });
        }.bind(this));
    }
};
