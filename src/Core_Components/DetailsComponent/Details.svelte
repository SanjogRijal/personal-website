<script>
	export let detailsHeading;
	export let detailsBody;
	export let detailsFooter;
	export let detailsSubheading;
</script>

<style>
	section {

    bottom: 69px;
    position: absolute;
    top: 45px;
    left: 45%;
	}

	.details-wrapper {
		    background-color: white;
    padding: 18px;
}


	.detailsHeading {
		    color: #1F2667;
    text-align: center;
    font-family: 'Domine', serif;
font-family: 'Lato', sans-serif;
        font-size: 48px;
	}

	.detailsBody {
		font-size: 21px;
		    font-weight: 400;
    line-height: 1.4;
    font-family: 'Montserrat', sans-serif;
	}

	.details-body {
		/*margin-left: 79px;
		margin-right: 79px;*/
		justify-content: center;
	}

	.detailsFooter {
		text-align:center;
	}


@media screen and (min-width: 200px) and (max-width: 700px) {

    section {
	    background-color: white;
	    bottom: 69px;
	    position: absolute;
	    top: 398px;
	    left: -10%;
    }

    .details-body {
    	margin-left: 0px;
    	margin-right: 0px;
    	justify-content: center;
    }
}
@media screen and (min-width: 700px) and (max-width:1800){
	section {
		left: 45%
	
	}

}

@media screen and (min-width: 1800px) {
	section {
		left: 34%;
	}

}




	
</style>

<section>
	<div class="details-section details-wrapper">
		<div class="details-header">
			<h1 class="detailsHeading">{detailsHeading}</h1>
		{#if detailsSubheading}	
			<h3 class = "subHeading">{detailsSubheading}</h3>
		{/if}
		</div>
		<hr/>
		<div class="details-body">
			<p class="detailsBody">{detailsBody}</p>
		</div>
		<hr/>
		<div class="details-footer">
			<h4 class = "detailsFooter">{detailsFooter}</h4>
		</div>
	</div>
</section>

