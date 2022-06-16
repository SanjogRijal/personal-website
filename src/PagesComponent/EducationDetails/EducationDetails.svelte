<script>
	import Img from '../../Core_Components/ImageComponent/Image.svelte';
	import Details from '../../Core_Components/DetailsComponent/Details.svelte';
	let educationDetails = [];

</script>

<style>

	.education-detail-masters {
		position: relative;
		top: 700px;
	}

	.education-detail-bachelors{
		position: relative;
		top: 1400px;
	}

	.education-detail-bnks{
		position: relative;
		top: 2100px;
	}


</style>

<section>
	


<div class = "education-details-wrapper">
	<div class="education-detail-masters">
		<Img src="/images/education_details_image_mca.jpg" alt="Masters Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="PGDCA | MCA" detailsSubheading = "PGDCA/MCA (2018-2021)" detailsBody = "Software Engineering | Computer Organization | Design and Analysis of Algorithms and Structure | Advanced Java | Web Technologies | Advance Operating Systems | Advanced DBMS | Artificial Intelligence" detailsFooter = "Masters Level"/>	
	
	</div>
</div>



<div class = "education-details-wrapper">
	<div class="education-detail-bachelors">
		<Img src="/images/education_details_image_bachelors.png" alt="Masters Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="Bachelors of Computer Information Systems" detailsSubheading = "BCIS (2013-2017)" detailsBody = "Problem Solving | Java | Advanced Java | Computer Architecture & Organization | Data Structure  Web Technologies | Networking and Operating Systems | Project Management" detailsFooter = "Bachelors Level"/>	
	
	</div>
	</div>	

	<div class = "education-details-wrapper">
	<div class="education-detail-bnks">
		<Img src="/images/education_details_image_bnks.jpeg" alt="BNKS Image" type = "coverPhoto"/>	
	
		<Details detailsHeading ="A-levels/SLC" detailsSubheading = "SLC/A-levels(2010-2012)" detailsBody = "Economics | Business | Sociology | Pure Maths | General Paper" detailsFooter = "Secondary/Higher Secondary Level"/>	
	
	</div>
	</div>	
</section>