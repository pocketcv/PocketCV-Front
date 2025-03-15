import imgCross from '../../../public/close.png';

function Profile(){
    return (
        <div>
            <div className="flex justify-between">
                <h1>hi profile</h1>
                <img src={imgCross} alt="Icon-cross" />
            </div>
        </div>
    )
}

export default Profile