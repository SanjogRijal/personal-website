<script>
	export let src;
	export let alt;
	export let type;
</script>

<style>
	.roundImage img {
		border-radius:  10px;
		width: 16%;
	}
	

	.image-wrapper{
		margin-top: 20px;
	}


.coverPhoto{
    height: 400px;
    border-radius: 44%;
    margin-bottom: 83px;
    margin-top: 25px;
    left: 5%;
    position: absolute;
    width: 347px;
}

</style>

<section class="image-wrapper">
	{#if type=="fullImage"}
	<div class="img-section fullImage">
		<img src={src} alt={alt}>
	</div>
	{/if}

	{#if type=="roundImage"}
	<div class = "img-section roundImage">
		<img src = {src} alt = {alt}/>
	</div>
	{/if}

	{#if type=="coverPhoto"}
	<div class = "img-section">
		<img class = "coverPhoto" src = {src} alt = {alt}/>
	</div>
	{/if}
</section>