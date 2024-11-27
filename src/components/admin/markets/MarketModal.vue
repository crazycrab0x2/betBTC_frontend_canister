<template>
  <Dialog :open="visible">
    <DialogContent class="lg:w-[1440px] bg-[#0a0a0a]  text-[#FAFAFA]  md:w-[900px] sm:w-[600px] w-[450px] h-fit rounded-[12px] border-none max-w-none">
      <div class="relative flex flex-col sm:p-[25px] p-[10px]">
        <p class="space-grotesk text-[#FAFAFA] text-[24px] leading-[32px] font-medium flex justify-center items-center">
          <span v-if="market">Edit</span>
          <span v-else>Create New</span>
          Market
        </p>
        <div class="flex sm:flex-row flex-col gap-4">
          <div class="w-[60%]">
            <div class="flex sm:flex-row flex-col gap-[10px] justify-center items-center">
              <div class="relative w-[200px] p-[20px] h-auto">
                <img
                  :src="bgImage ? bgImage : '/default0.svg'"
                  width="120"
                  class="rounded-[12px] object-cover aspect-square mx-auto"
                />
                <div
                  class="absolute group w-full h-full top-0 left-0 file-drop-area flex-grow flex gap-4 items-center justify-center rounded-[12px] px-6 py-4 cursor-pointer hover:bg-[#2d3748B3]"
                  @click="onClickImg"
                >
                  <Icon
                    icon="ion:cloud-upload-outline"
                    color="#FAFAF1"
                    width="40"
                    height="40"
                    class="opacity-0 group-hover:opacity-100"
                  />

                  <input
                    id="file-upload"
                    type="file"
                    class="hidden"
                    ref="fileInput"
                    @change="onFileChange"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-[8px] w-full">
                <div class="flex flex-col gap-[8px] items-start">
                  <span>Market ID</span>
                  <div
                    class="w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                  >
                    <input
                      :disabled="market ? true : false"
                      v-model="marketID"
                      placeholder="Market ID"
                      class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-[8px] items-start">
                  <span>Title</span>
                  <div
                    class="w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                  >
                    <input
                      :disabled="market ? true : false"
                      v-model="title"
                      placeholder="Title"
                      class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                    />
                  </div>
                </div>
                <div class="flex sm:flex-row flex-col justify-between items-center">
                  <div class="flex flex-col gap-[8px] items-start sm:w-1/2 w-full">
                    <span>Market Version</span>
                    <select
                      class="text-white sm:w-[250px] w-full rounded-[12px] px-[18px] py-[10px] bg-[#0a0a0a] outline-none border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                      :disabled="market ? true : false"
                    >
                      <option
                        :value="MarketVersion.V1"
                        :selected="version == MarketVersion.V1 ? true : false"
                        @click="() => onClickWithVersion(MarketVersion.V1)"
                      >
                        V1
                      </option>
                      <option
                        :value="MarketVersion.V2"
                        :selected="version == MarketVersion.V2 ? true : false"
                        @click="() => onClickWithVersion(MarketVersion.V2)"
                      >
                        V2
                      </option>
                    </select>
                  </div>
                  <div class="flex flex-col gap-[8px] items-start sm:w-1/2 w-full">
                    <span>Expire Date (GMT)</span>
                    <div
                      class="w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                    >
                      <VueDatePicker
                        class="bg-black dp__theme_dark"
                        v-model="expireDate"
                        time-picker-inline
                        timezone="UTC"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div class="flex flex-col gap-[8px] items-start">
                <span>Description</span>
                <textarea
                  v-model="description"
                  placeholder="Description"
                  class="w-full outline-none flex gap-2 rounded-[12px] px-[16px] py-[6px] sm:px-[18px] sm:py-[10px] bg-transparent border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px] placeholder-[#A1A1A9] text-[#E4E4E7] text-[16px]"
                  rows="2"
                ></textarea>
              </div>
              <div class="flex flex-col gap-[8px] items-start">
                <span>Category</span>
                <div
                  class="flex flex-row-reverse w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                >
                  <Icon
                    icon="system-uicons:plus"
                    :class="category ? 'cursor-pointer' : 'cursor-not-allowed'"
                    :color="category ? '#E88340' : '#A1A1A9'"
                    width="25"
                    height="25"
                    @click="onClickPlusCategory"
                  />
                  <input
                    v-model="category"
                    placeholder="Category"
                    class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                  />
                </div>
                <div class="flex flex-row gap-[6px]">
                  <div
                    v-for="(category, index) in categories"
                    :key="index"
                    class="flex flex-col border-[1px] rounded-[8px] px-[8px] py-[4px]"
                  >
                    <div class="flex justify-end">
                      <Icon
                        icon="ic:baseline-close"
                        color="#ffffff"
                        width="15"
                        height="15"
                        class="cursor-pointer"
                        @click="() => onRemoveCategory(category)"
                      />
                    </div>
                    <span class="text-[16px] p-[4px]">{{ category }}</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-[8px] items-start">
                <span>Resolve Link</span>
                <div
                  class="w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                >
                  <input
                    v-model="resolveLink"
                    placeholder="Input resolve link"
                    class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-[8px] items-start">
                <span>Add Options(at least one option)</span>
                <div
                  class="flex flex-row-reverse w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
                >
                  <Icon
                    icon="system-uicons:plus"
                    :class="option ? 'cursor-pointer' : 'cursor-not-allowed'"
                    :color="option ? '#E88340' : '#A1A1A9'"
                    width="25"
                    height="25"
                    @click="onClickPlusOption"
                  />
                  <input
                    :disabled="market ? true : false"
                    v-model="option"
                    placeholder="Input Option"
                    class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                  />
                </div>
                <div class="flex flex-row gap-[6px]">
                  <div
                    v-for="(option, index) in options"
                    :key="index"
                    class="flex flex-col border-[1px] rounded-[8px] px-[8px] py-[4px]"
                  >
                    <div v-if="!market" class="flex justify-end">
                      <Icon
                        icon="ic:baseline-close"
                        color="#ffffff"
                        width="15"
                        height="15"
                        class="cursor-pointer"
                        @click="() => onRemoveOption(option)"
                      />
                    </div>
                    <span class="text-[16px] p-[4px]">{{ option }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-[6px] my-[12px]">
              <button
                class="bg-[#FF9046] rounded-[12px] px-[12px] py-[6px] flex oranj-button w-full justify-center items-center"
                @click="onClickCreateBtn"
              >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#121212"
                  width="25"
                  height="25"
                />
                <span
                  v-else
                  class="inter font-[500] sm:leading-[22px] sm:text-[16px] leading-[20px] text-[14px] text-[#121212]"
                >
                  <span v-if="market">Update</span> <span v-else>Create</span>
                </span>
              </button>
            </div>
          </div>
          <div class="w-[40%]">
            <div class="flex flex-col gap-[8px] items-start">
              <span>Market JSON Data</span>
              <div
                class="w-full rounded-[12px] px-[18px] py-[10px] border-[#3F3F45] hover:border-[#52525A] focus-within:!border-[#B56632] border-[1px]"
              >
                <textarea
                  rows="29"
                  v-model="marketJSONData"
                  placeholder="Please paste market JSON data"
                  class="outline-none bg-transparent placeholder-[#A1A1A9] inter font-[500] text-[16px] leading-[22px] text-[#E4E4E7] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogClose class="close-button" @click="onCloseModal">
        <Icon
          icon="ic:baseline-close"
          color="#ffffff"
          width="24"
          height="24"
          class="cursor-pointer"
        />
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { convertToDataURL } from '@/utils/image'
import { useToast } from 'vue-toastification'
import VueDatePicker from '@vuepic/vue-datepicker'
import { useAuthStore } from '@/stores/auth'
import { asRawMarketVersion, MarketVersion, type Market } from '@/types/marketDataTypes'
import { BANNED_CATEGORY_LIST_FROM_CREATE_UPDATE } from '@/config/market'
import config from '@/config'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'

const { onClose, market } = defineProps<{
  visible: boolean
  market?: Market
  onClose: () => void
}>()

interface MarketJSONType {
  id: string
  title: string
  categories: string[]
  image_link: string
  expire_at: string
  resolve_link: string
  description: string
  options: string[]
  version: string
}

const toast = useToast()
const authStore = useAuthStore()
const { authClient, backendActor } = storeToRefs(authStore)

const isLoading = ref<boolean>(false)
const marketID = ref<string>('')
const title = ref<string>('')
const expireDate = ref<any>(new Date())
const bgImage = ref<any>('')
const description = ref<string>('')
const category = ref<string>('')
const categories = ref<Array<string>>([])
const resolveLink = ref<string | undefined>('')
const option = ref<string>('')
const options = ref<Array<string>>([])
const imageByteArray = ref<Uint8Array | number[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const version = ref<MarketVersion>(MarketVersion.V2)
const marketJSONData = ref<string>('')
const marketJSONProcessTimer = ref<any>(null)

const actor = backendActor.value

watch(
  () => market,
  () => {
    if (market) {
      marketID.value = market.id
      title.value = market.title
      version.value = market.version
      expireDate.value = new Date(market.expireAt)
      description.value = market.description
      bgImage.value = market.image
      categories.value = [
        ...market.categories.filter((a) => !BANNED_CATEGORY_LIST_FROM_CREATE_UPDATE.includes(a)),
        ...market.categories.filter((a) => BANNED_CATEGORY_LIST_FROM_CREATE_UPDATE.includes(a))
      ]
      options.value = market.options.map((a) => a.option)
      resolveLink.value = market.resolveLink
    } else {
      marketID.value = ''
      title.value = ''
      version.value = MarketVersion.V2
      expireDate.value = new Date().toUTCString()
      description.value = ''
      bgImage.value = ''
      categories.value = []
      options.value = []
      resolveLink.value = ''
    }
  }
)

watch(
  () => marketJSONData.value,
  () => {
    clearTimeout(marketJSONProcessTimer.value)
    if (!marketJSONData.value) return

    marketJSONProcessTimer.value = setTimeout(() => {
      try {
        const marketJSON: MarketJSONType = JSON.parse(marketJSONData.value)

        if (market && market.id !== marketJSON.id) {
          toast.error('Market ID is not matched with JSON data! Please check again.')
          return
        }

        marketID.value = marketJSON.id
        title.value = marketJSON.title
        categories.value = marketJSON.categories
        bgImage.value = marketJSON.image_link
        expireDate.value = new Date(Number(marketJSON.expire_at))
        resolveLink.value = marketJSON.resolve_link
        description.value = marketJSON.description
        options.value = marketJSON.options
        version.value =
          marketJSON.version.toLocaleUpperCase() === 'V1' ? MarketVersion.V1 : MarketVersion.V2
      } catch (error) {
        toast.error('Please input correct JSON data.')
      }
    }, 1000)
  }
)

watch(
  () => [
    marketID.value,
    title.value,
    categories.value.length,
    bgImage.value,
    expireDate.value,
    resolveLink.value,
    description.value,
    options.value.length,
    version.value
  ],
  () => {
    marketJSONData.value = `{
      "id": "${marketID.value}",
      "title": "${title.value}",
      "categories": ${JSON.stringify(categories.value)},
      "image_link": "${bgImage.value}",
      "expire_at": "${BigInt(new Date(expireDate.value).getTime())}",
      "resolve_link": "${resolveLink.value}",
      "description": "${description.value}",
      "options": ${JSON.stringify(options.value)},
      "version": "${version.value === MarketVersion.V1 ? 'V1' : 'V2'}"
    }`
  }
)

const onClickCreateBtn = async () => {
  if (isLoading.value) return
  if (!authClient.value) return
  if (!marketID.value) {
    toast.info('MarketID is empty!')
    return
  }
  if (!title.value) {
    toast.info('Market Title is empty!')
    return
  }
  if (!expireDate.value) {
    toast.info('Expire date is empty!')
    return
  }
  if (!description.value) {
    toast.info('Description is empty!')
    return
  }
  if (!resolveLink.value) {
    toast.info('Resolve Link is empty!')
    return
  }
  if (categories.value.length == 0) {
    toast.info('Category is empty!')
    return
  }
  if (options.value.length == 0) {
    toast.info('Option is empty!')
    return
  }
  isLoading.value = true
  const avatarKey = nanoid()
  if (
    bgImage.value &&
    imageByteArray.value.length > 0 &&
    !bgImage.value.includes('/default') &&
    !bgImage.value.includes(config.VITE_CANISTER_ID_BACKEND)
  ) {
    const uploadImageResult = (await actor.upload_market_image(
      avatarKey,
      imageByteArray.value
    )) as string
    bgImage.value = `https://${config.VITE_CANISTER_ID_BACKEND}.raw.icp0.io/market/${uploadImageResult}`
  }
  const expireDate_timeStamp = BigInt(new Date(expireDate.value).getTime())
  if (market) {
    const market_res = await actor.update_market(
      marketID.value,
      bgImage.value === market.image ? [] : [bgImage.value],
      description.value === market.description ? [] : [description.value],
      expireDate.value.getTime() === market.expireAt.getTime() ? [] : [expireDate_timeStamp],
      categories.value.length === market.categories.length &&
        categories.value.every((v, index) => v === market.categories[index])
        ? []
        : [categories.value.filter((a) => !BANNED_CATEGORY_LIST_FROM_CREATE_UPDATE.includes(a))],
      resolveLink.value === market.resolveLink ? [] : [resolveLink.value],
      [true]
    )
    if ('Ok' in market_res) {
      toast.success('Updated Successfully!')
    } else {
      toast.error(market_res.Err ?? 'Market update failed!')
    }
  } else {
    const market_res = await actor.create_market(
      marketID.value,
      title.value,
      bgImage.value ? bgImage.value : '/default0.svg',
      description.value,
      [],
      expireDate_timeStamp,
      categories.value,
      resolveLink.value,
      options.value,
      true,
      asRawMarketVersion(version.value)
    )
    if ('Ok' in market_res) {
      toast.success('Market Created Successfully!')
    } else {
      toast.error(market_res.Err ?? 'Market creation failed!')
    }
  }
  onCloseModal()
  isLoading.value = false
}

const onClickPlusCategory = () => {
  if (!category.value) return
  if (categories.value.find((a) => a === category.value)) {
    toast.error('Duplicated category.')
    category.value = ''
    return
  }
  if (BANNED_CATEGORY_LIST_FROM_CREATE_UPDATE.find((a) => a === category.value)) {
    toast.error('It is banned category')
    category.value = ''
    return
  }
  categories.value.push(category.value)
  category.value = ''
}

const onClickPlusOption = () => {
  if (!option.value) return
  if (options.value.find((a) => a === option.value)) {
    toast.error('Duplicated option')
    option.value = ''
    return
  }
  options.value.push(option.value)
  option.value = ''
}

const onClickWithVersion = (value: MarketVersion) => {
  version.value = value
}

const onFileChange = () => {
  const files = fileInput.value?.files
  if (files) {
    handleFiles(files)
  }
}

const handleFiles = (files: FileList) => {
  const reader = new FileReader()
  reader.onload = async (_e) => {
    const arrayBuffer = await files[0].arrayBuffer()
    const byteArray = new Uint8Array(arrayBuffer)
    imageByteArray.value = byteArray
    const chunks = []
    chunks.push(new Uint8Array(byteArray))

    const blob = new Blob(chunks, { type: 'image/jpeg' })

    let new_url = await convertToDataURL(blob)
    bgImage.value = new_url
  }

  reader.readAsArrayBuffer(files[0])
}

const onClickImg = () => {
  fileInput.value?.click()
}

const onCloseModal = () => {
  marketID.value = ''
  title.value = ''
  bgImage.value = ''
  version.value = MarketVersion.V2
  expireDate.value = new Date().toUTCString()
  description.value = ''
  option.value = ''
  options.value = []
  category.value = ''
  categories.value = []
  resolveLink.value = ''
  fileInput.value = null
  imageByteArray.value = []
  isLoading.value = false
  marketJSONData.value = ''
  onClose()
}

const onRemoveCategory = (category: string) => {
  categories.value = categories.value.filter((a) => a !== category)
}

const onRemoveOption = (option: string) => {
  if (market) return
  options.value = options.value.filter((a) => a !== option)
}
</script>

<style scoped>
.close-button {
  z-index: 20;
  position: absolute;
  padding: 10px;
  top: 10px;
  right: 10px;
  /* background-color: #ff90460d; */
  border-radius: 12px;
  color: white;
}

.close-button:hover {
  background-color: #ff90461a;
}

.close-button:active {
  background-color: #ff90460d;
  box-shadow: 0px 0px 0px 4px #ff904633;
}

.dp__theme_dark {
  --dp-background-color: #0a0a0a;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #005cb2;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #0a0a0a;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #0a0a0a;
  --dp-border-color-focus: #0a0a0a;
}
</style>
