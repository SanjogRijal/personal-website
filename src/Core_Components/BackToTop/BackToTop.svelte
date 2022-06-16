<style>#scroll {
    position:fixed;
    right:10px;
    bottom:10px;
    cursor:pointer;
    width:50px;
    height:50px;
    background-color:#3498db;
    text-indent:-9999px;
    /*display:none;*/
    -webkit-border-radius:60px;
    -moz-border-radius:60px;
    border-radius:60px
}

#scroll span {
    position:absolute;
    top:50%;
    left:50%;
    margin-left:-8px;
    margin-top:-12px;
    height:0;
    width:0;
    border:8px solid transparent;
    border-bottom-color:#ffffff;
}
#scroll:hover {
    background-color:#e74c3c;
    opacity:1;filter:"alpha(opacity=100)";
    -ms-filter:"alpha(opacity=100)";
}</style>

<a href="javascript.void(0)" bind:this={backToTop} id="scroll" on:click={scroller}><span></span></a>

<script>
import {onMount} from 'svelte';
let backToTop;
let topNotch;
onMount(()=> {
    console.log(window.scrollY);
    topNotch = backToTop;
    if(window.scrollY > 150) {
        console.log(backToTop);
        backToTop.style.display='block';
        console.log("DOM", document.getElementById('backToTop'));
    } else {
        console.log(backToTop);
    }

})  
console.log(topNotch);

let scroller = (target) => {
    document.getElementsByTagName("html")[0].scrollBy(0,0); 
    document.getElementsByTagName("body")[0].scrollBy(0,0);
}

</script>
