const API = "https://api.github.com/users";
async function search_user(){
    const userInput =document.getElementById("userInput").value.toLowerCase();
    try{
        const response = await fetch(`${API}/${userInput}`);
        if(!response.ok){
            throw new Error("User not found!");
        }
        const data = await response.json();
        console.log(data);
        display_Info(data);
        repos_Info(data.login);
    }
    catch(error){
        console.log(error.message);
    }
}


function display_Info(data){
    const avatarID = document.getElementById("avatar");
    const fullNameID = document.getElementById("fullName");
    const loginID = document.getElementById("login");
    const bioID = document.getElementById("bio");

    const reposCountID = document.getElementById("reposCount");
    const followersID = document.getElementById("followers");
    const followingID = document.getElementById("following");
    avatarID.src = data.avatar_url;
    avatarID.style.display="block";

    fullNameID.textContent = data.name;

    loginID.textContent = data.login;

    bioID.textContent = data.bio;

    reposCountID.textContent = data.public_repos;

    followersID.textContent = data.followers;

    followingID.textContent = data.following;
    
    const openProfile = document.getElementById("openProfile");
    openProfile.addEventListener("click",()=>{
    window.open(data.html_url, '_blank');
    })


    const copyUrl = document.getElementById("copyUrl");
    copyUrl.style.display = "";
    copyUrl.onclick = ()=>{
        navigator.clipboard.writeText(data.html_url);
        copyUrl.textContent = 'Copied!';
        setInterval(()=>copyUrl.textContent = "Copy URL",1200);
    }

    const downloadJson = document.getElementById("downloadJson");
    downloadJson.style.display='';
    downloadJson.onclick = ()=> {
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    a.href = URL.createObjectURL(blob); 
    a.download = `${data.login}-profile.json`;
    a.click(); 
    URL.revokeObjectURL(a.href);

    console.log(data.repos)
  };
}   

async function repos_Info(username) {
    try {
        const repos_data = await fetch(`${API}/${username}/repos`);
        if (!repos_data.ok) {
            throw new Error("Please upload any repository!");
        }

        const repos = await repos_data.json(); 
        const reposDiv = document.getElementById("reposList");
        reposDiv.innerHTML = '';

        repos.forEach(repo => {
            const div = document.createElement("div");
            div.innerHTML = `<div class="repo_div">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            
                <p>${repo.description}</p>
            </div>`;
            reposDiv.appendChild(div);
        });

        localStorage.setItem("reposList", JSON.stringify(repos));

    } catch (error) {
        console.log(error.message);
    }
}
