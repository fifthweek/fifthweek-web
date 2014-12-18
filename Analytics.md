# Analytics

When tracking new information, first ask 'is this unique or cohort data?'. Sometimes it may comprise both, in which
case you must split the data out and track it separately, as described below:

## Cohort data

Any data that is common across multiple users. This is used to track group behaviour through cohort analysis.

Cohort data is sent to:

-   Google Analytics

-   KISSmetrics

Tracking methods:

-   Page views: handled automatically by Angulartics.

-   Events: `eventTrack('Noun past-tense-verb', { category: 'Singular noun'})`

    -   Correct: `eventTrack('Registration submitted', { category: 'Registration'})`

    -   Incorrect: `eventTrack('Registration submitted', { category: '*Registrations*'})`
    
    -   Incorrect: `eventTrack('Registration *submission*', { category: 'Registration'})`

    -   Incorrect: `eventTrack('*Submitted registration*', { category: 'Registration'})`

**Do not** introduce additional properties into the final parameter of `eventTrack`. Google Analytics only supports a
specific set of properties (including `category`). Furthermore, KISSmetrics makes it difficult to query against
anything other than the event title, so there is little point tracking anything more through property bags.

## Unique data

Any data that is unique to a specific user. This is used to identify individual users.

Unique data is sent to:

-   Google Analytics (user ID only)

-   KISSmetrics (user ID & profiles for unauthenticated users)

**For authenticated users** the only unique data that must be tracked is the user ID to correlate data in our system
with the analytics. User ID tracking is achieved through `setUsername`. No analysis can be performed on unique data so
there is no benefit in sending it to the analytics platforms. Doing so would needlessly compromise the security of our 
users' data.

**For unauthenticated users** unique data must be tracked using `setUserProperties`. This is to allow communication with 
users that do not register, and to validate those individual experiences before communicating with them.
