export { default as Banner } from "./Banner.vue";

export enum BannerVariants {
  default = "default",
  warning = "warning",
  destructive = "destructive",
}

export const bannerVariantClasses: Record<BannerVariants, string> = {
  [BannerVariants.default]: "bg-gray-100 text-gray-800",
  [BannerVariants.warning]: "bg-yellow-100 text-yellow-800",
  [BannerVariants.destructive]: "bg-red-100 text-red-800",
};
