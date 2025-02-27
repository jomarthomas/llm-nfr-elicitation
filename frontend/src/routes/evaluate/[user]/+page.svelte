<script lang="ts">
	const FR = {
		functionalRequirement:
			'System shall request a deposit of Rs. 5000 upon entry of valid customer information and update it temporarily in the customer database.',
		identifiedNFRs: [
			{
				attribute: 'Functional Suitability',
				requirement:
					'Functional Correctness: The system must accurately update the customer database with the temporary deposit information for 99.9% of valid customer entries.',
				justification:
					'The FR requires the system to correctly process and update customer data, necessitating high accuracy.'
			},
			{
				attribute: 'Performance Efficiency',
				requirement:
					'Time Behavior: The system must process the deposit request and update the customer database in less than 500 milliseconds for up to 100 concurrent requests.',
				justification:
					'The FR involves real-time processing of financial transactions, requiring timely responses.'
			},
			{
				attribute: 'Security',
				requirement:
					'Integrity: The system must ensure that customer data and deposit information are handled in a way that prevents unauthorized modifications or tampering.',
				justification:
					'The FR involves sensitive financial data, requiring stringent integrity measures to prevent data corruption or manipulation.'
			}
		]
	};
</script>
