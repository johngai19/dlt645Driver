const RESULT_SUCCESS = 0;
const RESULT_FAILURE = 1;

function ThingAccessClient(config, {
    setProperties,
    getProperties,
    callService}
) { 
    return 0;
};

const  Config={
    get:(()=>{
        return new Promise((resolve,reject)=>{
            resolve({});
        })
    })
}
module.exports = {
    RESULT_SUCCESS: RESULT_SUCCESS,
    RESULT_FAILURE: RESULT_FAILURE,
    ThingAccessClient: ThingAccessClient,
    Config: Config
};
