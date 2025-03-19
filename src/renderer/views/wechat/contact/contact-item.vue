<script lang="ts" setup>
import { WxContact } from '@/typings/wx';
import { useElementVisibility } from '@vueuse/core';
import { ref, useTemplateRef, watch } from 'vue';

const props = defineProps({
    contact: {
        type: Object as () => WxContact,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["contact-click"]);
function onConversationClick() {
    emit("contact-click", props.contact);
}
let image = ref("");
const target = useTemplateRef<HTMLDivElement>("target");
const targetIsVisible = useElementVisibility(target);
watch(
    () => targetIsVisible.value,
    (newVal) => {
        if (newVal) {
            image.value = props.contact.smallHeadImgUrl || "";
        }
    }
);
</script>
<template>
    <div></div>
</template>