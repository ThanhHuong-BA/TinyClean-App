export type Option = { title: string; hint: string };
export type Question = { title: string; description: string; options: Option[]; cta: string };

export const questions: [Question, Question] = [
  {
    title: 'Tiệm của bạn đang ở giai đoạn nào?',
    description:
      'Chia sẻ với TinyClean một chút để mình gợi ý cách bắt đầu phù hợp nhất với bạn nhé.',
    options: [
      { title: 'Đã có tiệm, đang dùng phần mềm khác', hint: 'Mình muốn chuyển sang TinyClean' },
      { title: 'Đã có tiệm, chưa dùng phần mềm nào', hint: 'Đang ghi sổ tay, Excel hoặc nhớ trong đầu' },
      { title: 'Sắp mở tiệm', hint: 'Mình đang chuẩn bị khai trương' },
      { title: 'Chỉ đang tìm hiểu', hint: 'Xem thử TinyClean có gì hay' },
    ],
    cta: 'Tiếp tục',
  },
  {
    title: 'Bạn muốn bắt đầu thế nào?',
    description:
      'Làm quen trước với dữ liệu mẫu, hoặc bắt tay vào quản lý tiệm của bạn ngay đều được nhé.',
    options: [
      {
        title: 'Dùng thử với dữ liệu mẫu',
        hint: 'Có sẵn đơn hàng, khách hàng mẫu để bạn bấm thử thoải mái mọi tính năng',
      },
      {
        title: 'Tạo dữ liệu mới từ đầu',
        hint: 'Tiệm trống trơn, bạn tự thêm dịch vụ, khách hàng và đơn đầu tiên',
      },
    ],
    cta: 'Vào app TinyClean ngay',
  },
];

/** Index of the "Dùng thử với dữ liệu mẫu" option in step 2. */
export const DEMO_OPTION = 0;

export type StartMode = 'demo' | 'onboard';

export type OnboardingResult = {
  /** Index of the answer to "Tiệm của bạn đang ở giai đoạn nào?". */
  stage: number;
  mode: StartMode;
};

export const features: { key: FeatureIcon; text: string }[] = [
  { key: 'order', text: 'Tạo, quản lý và giao đơn theo đúng quy trình tiệm giặt' },
  { key: 'camera', text: 'Thêm hình ảnh và ghi chú yêu cầu của khách trước khi xử lý' },
  { key: 'bell', text: 'Thông báo các đơn hàng đến hẹn giao, trễ hẹn' },
  { key: 'printer', text: 'Kết nối máy in để in bill' },
  { key: 'wallet', text: 'Quản lý thu chi, công nợ, hạn chế thất thoát' },
  { key: 'chart', text: 'Báo cáo đơn hàng, doanh thu cập nhật tự động ngay trên điện thoại' },
];

export type FeatureIcon = 'order' | 'camera' | 'bell' | 'printer' | 'wallet' | 'chart';
