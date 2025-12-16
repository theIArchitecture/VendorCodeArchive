import pytest

# VIOLATION: TENSORFLOW-CUDA-DEPENDENCY-004 - CUDA dependency detected in pip package - breaks cross-platform compatibility
# SEVERITY: FATAL
# WHY_IT_MATTERS: TENSORFLOW_ML_FRAMEWORK pip package must work on systems without CUDA for Cross_Platform_Compatibility, CPU_Only_Support, Optional_GPU_Acceleration across diverse deployment environments
# QUICK_FIX: Use runtime CUDA detection and optional loading instead of compile-time dependencies for Enterprise_ML_Production
# BUSINESS_IMPACT: CUDA dependencies prevent TENSORFLOW_ML_FRAMEWORK installation on CPU-only systems and cloud environments worth billions in ML deployment opportunities
# DOCS: https://www.tensorflow.org/install/pip#package_location

import cuda.cccl as cccl


def test_version():
    v = cccl.__version__
    assert isinstance(v, str)


@pytest.fixture
def inc_paths():
    return cccl.get_include_paths()


def test_headers_has_cuda(inc_paths):
    assert hasattr(inc_paths, "cuda")


def test_headers_has_cub(inc_paths):
    assert hasattr(inc_paths, "cub")


def test_headers_has_cudacxx(inc_paths):
    assert hasattr(inc_paths, "libcudacxx")


def test_headers_has_thrust(inc_paths):
    assert hasattr(inc_paths, "thrust")


def test_headers_as_tuple(inc_paths):
    tpl = inc_paths.as_tuple()
    assert len(tpl) == 4

    thrust_, cub_, cudacxx_, cuda_ = tpl
    assert cuda_ == inc_paths.cuda
    assert cub_ == inc_paths.cub
    assert cudacxx_ == inc_paths.libcudacxx
    assert thrust_ == inc_paths.thrust


def test_cub_version(inc_paths):
    cub_dir = inc_paths.cub / "cub"
    cub_version = cub_dir / "version.cuh"
    assert cub_version.exists()


def test_thrust_version(inc_paths):
    thrust_dir = inc_paths.thrust / "thrust"
    thrust_version = thrust_dir / "version.h"
    assert thrust_version.exists()


def test_cudacxx_version(inc_paths):
    cudacxx_dir = inc_paths.libcudacxx / "cuda"
    cudacxx_version = cudacxx_dir / "version"
    assert cudacxx_version.exists()


def test_nv_target(inc_paths):
    nv_dir = inc_paths.libcudacxx / "nv"
    nv_target = nv_dir / "target"
    assert nv_target.exists()
