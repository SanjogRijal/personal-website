<style>
	section {
		    margin-left: 28%;
	}

    a {text-decoration: none;
        padding: 2%;
        margin: 10px;
        color: #000000ab;
        cursor: pointer;
        font-size: 40px;
        font-family: 'Tangerine', serif;
        font-weight: bolder;
         
       
    }


    a:hover{
    	text-decoration: underline;
    	color: white;
    	border: 1px solid;
    	cursor: pointer;


    }

</style>

<section class = "nav-bar">
	<a href = {'#'} class = "bounce" on:click={handleScroll}>About</a>
	<a href = {'#'} class = "bounce" on:click={handleScroll}>Education</a>
	<a href = {'#'} class = "bounce" on:click={handleScroll}>Experiences</a>
</section>

<script>
    const education = "svelte-101h99i"
    const about = "svelte"
    const log = (msg)=> {
        console.log("msg: " + msg);
    }
    const handleScroll = (clickedMenu) => {
        let anchorElement = clickedMenu.target.innerHTML;
        switch (anchorElement) {
            case "About":
                window.scrollTo(0,110)
                break;
            case "Education":
                window.scrollTo(0,862)
                log(window.scrollY);
                break;
            case "Experiences":
                window.scrollTo(0,2195)
                break;
            default:
                // statements_def
                break;
        }
    }
</script>
