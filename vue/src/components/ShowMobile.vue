<template>
  <b-container fluid>
    <b-row>
      <b-col sm="2">
        <label for="id">ID:</label>
      </b-col>
      <b-col sm="10">
        <p id="id" style="text-align: left">{{ mobile.id }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="2">
        <label for="model">Model:</label>
      </b-col>
      <b-col sm="10">
        <p id="model" style="text-align: left">{{ mobile.model }}</p>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col sm="2">
        <label for="producer">Producer:</label>
      </b-col>
      <b-col sm="10">
        <p id="producer" style="text-align: left">{{ mobile.producer }}</p>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col sm="2">
        <label for="price">Price:</label>
      </b-col>
      <b-col sm="10">
        <p id="price" style="text-align: left">{{ mobile.price }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ShowMobile",
  props: {
    mobile: Object,
  },
};
</script>